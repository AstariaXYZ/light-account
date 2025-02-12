// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";

import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import {EntryPoint} from "account-abstraction/core/EntryPoint.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {LibClone} from "solady/src/utils/LibClone.sol";
import {UserOperation} from "account-abstraction/interfaces/UserOperation.sol";

import {LightAccount} from "src/LightAccount.sol";
import {LightAccountFactory} from "src/LightAccountFactory.sol";
import {UpgradedLightAccount} from "test/mocks/UpgradedLightAccount.sol";
import {MockSP} from "test/mocks/MockSP.sol";

import "forge-std/console.sol";

contract LightAccountTest is Test {
    using stdStorage for StdStorage;
    using ECDSA for bytes32;

    address payable public constant BENEFICIARY = payable(address(0xbe9ef1c1a2ee));
    address constant factoryOwner = address(0x500);
    uint256 public EOA_PRIVATE_KEY = 1;
    address public eoaAddress;
    LightAccount public account;
    LightAccount public contractOwnedAccount;
    EntryPoint public entryPoint;
    LightSwitch public lightSwitch;
    LightAccountFactory public factory;
    Owner public contractOwner;
    LightAccount public implementation;

    MockSP SP;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Initialized(uint64 version);

    function setUp() public virtual {
        eoaAddress = vm.addr(EOA_PRIVATE_KEY);
        entryPoint = new EntryPoint();

        implementation = new LightAccount(entryPoint, factoryOwner);
        factory = implementation.factory();
        assertEq(factory.owner(), factoryOwner, "invalid factory owner");

        account = factory.createAccount(eoaAddress);
        vm.label(address(account), "account");
        vm.deal(address(account), 1 << 128);

        SP = new MockSP(factory);
        lightSwitch = new LightSwitch();
        contractOwner = new Owner();
        contractOwnedAccount = factory.createAccount(address(contractOwner));
        vm.deal(address(contractOwnedAccount), 1 << 128);
    }

    function testExecuteCanBeCalledByOwner() public {
        vm.prank(eoaAddress);
        account.execute(address(lightSwitch), 0, abi.encodeCall(LightSwitch.turnOn, ()));
        assertTrue(lightSwitch.on());
    }

    function testExecuteWithValueCanBeCalledByOwner() public {
        assertTrue(account.owner() == eoaAddress);
        vm.prank(eoaAddress);
        account.execute(address(lightSwitch), 1 ether, abi.encodeCall(LightSwitch.turnOn, ()));
        assertTrue(lightSwitch.on());
        assertEq(address(lightSwitch).balance, 1 ether);
    }

    function testExecuteCanBeCalledByEntryPointWithExternalOwner() public {
        UserOperation memory op =
            _getSignedOp(address(lightSwitch), abi.encodeCall(LightSwitch.turnOn, ()), EOA_PRIVATE_KEY);
        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = op;
        entryPoint.handleOps(ops, BENEFICIARY);
        assertTrue(lightSwitch.on());
    }

    function testExecutedCanBeCalledByEntryPointWithContractOwner() public {
        _useContractOwner();
        UserOperation memory op = _getUnsignedOp(address(lightSwitch), abi.encodeCall(LightSwitch.turnOn, ()));
        op.signature = contractOwner.sign(entryPoint.getUserOpHash(op));
        console.log("contract owner op.signature", op.signature.length);
        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = op;
        entryPoint.handleOps(ops, BENEFICIARY);
        assertTrue(lightSwitch.on());
    }

    function testRejectsUserOpsWithInvalidSignature() public {
        UserOperation memory op = _getSignedOp(address(lightSwitch), abi.encodeCall(LightSwitch.turnOn, ()), 1234);
        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = op;
        vm.expectRevert(abi.encodeWithSelector(IEntryPoint.FailedOp.selector, 0, "AA24 signature error"));
        entryPoint.handleOps(ops, BENEFICIARY);
    }

    function testExecuteCannotBeCalledByRandos() public {
        vm.expectRevert(abi.encodeWithSelector(LightAccount.NotAuthorized.selector, (address(this))));
        account.execute(address(lightSwitch), 0, abi.encodeCall(LightSwitch.turnOn, ()));
    }

    function testExecuteRevertingCallShouldRevertWithSameData() public {
        Reverter reverter = new Reverter();
        vm.prank(eoaAddress);
        vm.expectRevert("did revert");
        account.execute(address(reverter), 0, abi.encodeCall(Reverter.doRevert, ()));
    }

    function testExecuteBatchCalledByOwner() public {
        vm.prank(eoaAddress);
        address[] memory dest = new address[](1);
        dest[0] = address(lightSwitch);
        bytes[] memory func = new bytes[](1);
        func[0] = abi.encodeCall(LightSwitch.turnOn, ());
        account.executeBatch(dest, func);
        assertTrue(lightSwitch.on());
    }

    function testExecuteBatchFailsForUnevenInputArrays() public {
        vm.prank(eoaAddress);
        address[] memory dest = new address[](2);
        dest[0] = address(lightSwitch);
        dest[1] = address(lightSwitch);
        bytes[] memory func = new bytes[](1);
        func[0] = abi.encodeCall(LightSwitch.turnOn, ());
        vm.expectRevert(LightAccount.ArrayLengthMismatch.selector);
        account.executeBatch(dest, func);
    }

    function testExecuteBatchWithValueCalledByOwner() public {
        vm.prank(eoaAddress);
        address[] memory dest = new address[](1);
        dest[0] = address(lightSwitch);
        uint256[] memory value = new uint256[](1);
        value[0] = uint256(1);
        bytes[] memory func = new bytes[](1);
        func[0] = abi.encodeCall(LightSwitch.turnOn, ());
        account.executeBatch(dest, value, func);
        assertTrue(lightSwitch.on());
        assertEq(address(lightSwitch).balance, 1);
    }

    function testExecuteBatchWithValueFailsForUnevenInputArrays() public {
        vm.prank(eoaAddress);
        address[] memory dest = new address[](1);
        dest[0] = address(lightSwitch);
        uint256[] memory value = new uint256[](2);
        value[0] = uint256(1);
        value[1] = uint256(1 ether);
        bytes[] memory func = new bytes[](1);
        func[0] = abi.encodeCall(LightSwitch.turnOn, ());
        vm.expectRevert(LightAccount.ArrayLengthMismatch.selector);
        account.executeBatch(dest, value, func);
    }

    function testInitialize() public {
        account = factory.createAccount(eoaAddress);
    }

    function testCannotInitializeWithZeroOwner() public {
        vm.expectRevert(abi.encodeWithSelector(LightAccountFactory.InvalidOwner.selector, (address(0))));
        account = factory.createAccount(address(0));
    }

    function testAddDeposit() public {
        assertEq(account.getDeposit(), 0);
        account.addDeposit{value: 10}();
        assertEq(account.getDeposit(), 10);
        assertEq(account.getDeposit(), entryPoint.balanceOf(address(account)));
    }

    function testWithdrawDepositToCalledByOwner() public {
        account.addDeposit{value: 10}();
        vm.prank(eoaAddress);
        account.withdrawDepositTo(BENEFICIARY, 5);
        assertEq(entryPoint.balanceOf(address(account)), 5);
    }

    function testWithdrawDepositToCannotBeCalledByRandos() public {
        account.addDeposit{value: 10}();
        vm.expectRevert(abi.encodeWithSelector(LightAccount.NotAuthorized.selector, (address(this))));
        account.withdrawDepositTo(BENEFICIARY, 5);
    }

    function testEntryPointGetter() public {
        assertEq(address(account.entryPoint()), address(entryPoint));
    }

    function testIsValidSignatureForEoaOwner() public {
        bytes32 digest = keccak256("digest");
        bytes memory signature = _sign(EOA_PRIVATE_KEY, account.getMessageHash(abi.encode(digest)));
        assertEq(account.isValidSignature(digest, signature), bytes4(keccak256("isValidSignature(bytes32,bytes)")));
    }

    function testIsValidSignatureForContractOwner() public {
        _useContractOwner();
        bytes32 digest = keccak256("digest");
        bytes memory signature = contractOwner.sign(account.getMessageHash(abi.encode(digest)));
        assertEq(account.isValidSignature(digest, signature), bytes4(keccak256("isValidSignature(bytes32,bytes)")));
    }

    function testIsValidSignatureRejectsInvalid() public {
        bytes32 digest = keccak256("digest");
        bytes memory signature = _sign(123, account.getMessageHash(abi.encode(digest)));
        assertEq(account.isValidSignature(digest, signature), bytes4(0xffffffff));
    }

    function testFactoryOwnerCanUpgradeAccountImplementation() public {
        // Upgrade to a normal SimpleAccount with a different entry point.
        IEntryPoint newEntryPoint = IEntryPoint(address(0x2000));
        UpgradedLightAccount newImplementation = new UpgradedLightAccount(newEntryPoint, factory);
        address prevOwner = account.owner();

        vm.prank(factoryOwner);
        account.upgradeToAndCall(address(newImplementation), "");

        UpgradedLightAccount upgradedAccount = UpgradedLightAccount(payable(account));
        assertEq(address(upgradedAccount.entryPoint()), address(newEntryPoint));
        assertEq(prevOwner, upgradedAccount.owner());
    }

    function testStorageSlots() public {
        // No storage at start (slot 0).
        bytes32 storageStart = vm.load(address(account), bytes32(uint256(0)));
        assertEq(storageStart, 0);

        // Instead, storage at the chosen locations.
        bytes32 accountSlot =
            keccak256(abi.encode(uint256(keccak256("light_account_v1.storage")) - 1)) & ~bytes32(uint256(0xff));
        address owner = abi.decode(abi.encode(vm.load(address(account), accountSlot)), (address));
        assertEq(owner, eoaAddress);

        bytes32 initializableSlot =
            keccak256(abi.encode(uint256(keccak256("light_account_v1.initializable")) - 1)) & ~bytes32(uint256(0xff));
        uint8 initialized = abi.decode(abi.encode(vm.load(address(account), initializableSlot)), (uint8));
        assertEq(initialized, 1);
    }

    //Will only be used with lazy deployment
    //function testValidateInitCodeHash() external {
    //    assertEq(
    //        keccak256(
    //            abi.encodePacked(
    //                type(LightAccountFactory).creationCode,
    //                bytes32(uint256(uint160(0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789)))
    //            )
    //        ),
    //        0x2ad62a8bb3850247ef0c4f04e30b584e6eee7caa0e063745e90956653b90eb84
    //    );
    //}

    function _useContractOwner() internal {
        account = contractOwnedAccount;
    }

    function _getUnsignedOp(address target, bytes memory innerCallData) internal view returns (UserOperation memory) {
        return UserOperation({
            sender: address(account),
            nonce: 0,
            initCode: "",
            callData: abi.encodeCall(LightAccount.execute, (target, 0, innerCallData)),
            callGasLimit: 1 << 24,
            verificationGasLimit: 1 << 24,
            preVerificationGas: 1 << 24,
            maxFeePerGas: 1 << 8,
            maxPriorityFeePerGas: 1 << 8,
            paymasterAndData: "",
            signature: ""
        });
    }

    function _getSignedOp(address target, bytes memory innerCallData, uint256 privateKey)
        internal
        view
        returns (UserOperation memory)
    {
        UserOperation memory op = _getUnsignedOp(target, innerCallData);
        op.signature = _sign(privateKey, entryPoint.getUserOpHash(op).toEthSignedMessageHash());
        return op;
    }

    function _sign(uint256 privateKey, bytes32 digest) internal pure returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return abi.encodePacked(r, s, v);
    }
}

contract LightSwitch {
    bool public on;

    function turnOn() external payable {
        on = true;
    }
}

contract Reverter {
    function doRevert() external pure {
        revert("did revert");
    }
}

contract Owner is IERC1271 {
    function sign(bytes32 digest) public pure returns (bytes memory) {
        return abi.encodePacked("Signed: ", digest);
    }

    function isValidSignature(bytes32 digest, bytes memory signature) public pure override returns (bytes4) {
        if (keccak256(signature) == keccak256(sign(digest))) {
            return bytes4(keccak256("isValidSignature(bytes32,bytes)"));
        }
        return 0xffffffff;
    }
}
