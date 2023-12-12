// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import {ERC20} from "solady/src/tokens/ERC20.sol";
import {MockERC20} from "solady/test/utils/mocks/MockERC20.sol";
import {SpentItem, ItemType} from "seaport-types/lib/ConsiderationStructs.sol";
import {ECDSA, LightAccountTest, LightAccount, UserOperation, IEntryPoint} from "test/LightAccount.t.sol";
import {MockSP} from "test/mocks/MockSP.sol";
import {MockAAVE} from "test/mocks/MockAAVE.sol";
import "forge-std/console.sol";
import {_packValidationData} from "account-abstraction/core/Helpers.sol";

contract CaveatFallbackTest is LightAccountTest {
    using ECDSA for bytes32;

    MockAAVE AAVE = new MockAAVE();
    MockERC20 collateralToken = new MockERC20("CT", "CT", 18);
    MockERC20 debtToken = new MockERC20("DT", "DT", 18);
    uint256 amount = 10 ether;
    uint48 validUntil = 0;
    uint48 validAfter = 0;
    bytes32 salt = 0;
    bytes initCode = "";

    function executeBatch(address[] calldata dest, bytes[] calldata func) public virtual {}

    function setUp() public virtual override {
        super.setUp();
        collateralToken.mint(eoaAddress, amount);
        debtToken.mint(address(AAVE), amount);

        vm.prank(eoaAddress);
        collateralToken.approve(address(SP), amount);
    }

    function testExecuteCaveatBatchCalledByOwner() public {
        (address[] memory dest, bytes[] memory func) = _getBatch();

        vm.prank(eoaAddress);
        account.executeBatch(dest, func);

        assertEq(collateralToken.balanceOf(address(AAVE)), amount);
        assertEq(debtToken.balanceOf(address(account)), amount);
    }

    function testExecuteCaveatBatchCalledByEntrypoint() public {
        (address[] memory dest, bytes[] memory func) = _getBatch();

        //Sign Batch Op
        UserOperation memory op = _getSignedOpBatch(dest, func, EOA_PRIVATE_KEY);

        //Bundle ops
        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = op;
        entryPoint.handleOps(ops, BENEFICIARY);

        assertEq(collateralToken.balanceOf(address(AAVE)), amount);
        assertEq(debtToken.balanceOf(address(account)), amount);
    }

    function testExecuteCaveatBatchCalledByEntrypointBeforeStart() public {
        (address[] memory dest, bytes[] memory func) = _getBatch();

        validAfter = uint48(block.timestamp + 1 days);
        //Sign Batch Op
        UserOperation memory op = _getSignedOpBatch(dest, func, EOA_PRIVATE_KEY);

        //Bundle ops
        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = op;
        vm.expectRevert(abi.encodeWithSelector(IEntryPoint.FailedOp.selector, 0, "AA22 expired or not due"));
        entryPoint.handleOps(ops, BENEFICIARY);
        skip(1 days);
        entryPoint.handleOps(ops, BENEFICIARY);
    }

    function _getSignedOpBatch(address[] memory dest, bytes[] memory func, uint256 privateKey)
        internal
        view
        returns (UserOperation memory)
    {
        uint256[] memory values = new uint256[](dest.length);
        UserOperation memory op = UserOperation({
            sender: address(account),
            nonce: 0,
            initCode: initCode,
            callData: abi.encodeCall(
                LightAccount.executeBatchWithValidationData,
                (_packValidationData(false, validUntil, validAfter), dest, values, func)
                ),
            callGasLimit: 1 << 24,
            verificationGasLimit: 1 << 24,
            preVerificationGas: 1 << 24,
            maxFeePerGas: 1 << 8,
            maxPriorityFeePerGas: 1 << 8,
            paymasterAndData: "",
            signature: ""
        });

        op.signature = _sign(privateKey, entryPoint.getUserOpHash(op).toEthSignedMessageHash());
        console.log("op.signature length", op.signature.length);
        return op;
    }

    function _getBatch() internal view returns (address[] memory dest, bytes[] memory func) {
        dest = new address[](5);
        func = new bytes[](5);

        //1. Validate caveat salt
        dest[0] = address(account);
        func[0] = abi.encodeCall(LightAccount.isValidSalt, (SP, salt));

        //2. Withdraw asset using SP approval
        SpentItem[] memory spentItems = new SpentItem[](1);
        spentItems[0] =
            SpentItem({itemType: ItemType.ERC20, token: address(collateralToken), identifier: 0, amount: amount});
        dest[1] = address(SP);
        func[1] = abi.encodeCall(MockSP.acquireTokens, (spentItems));

        //3. Approve asset to destination as necessary
        dest[2] = address(collateralToken);
        func[2] = abi.encodeCall(ERC20.approve, (address(AAVE), amount));

        //4. Supply
        dest[3] = address(AAVE);
        func[3] = abi.encodeCall(MockAAVE.supply, (address(collateralToken), amount));

        //5. Borrow
        dest[4] = address(AAVE);
        func[4] = abi.encodeCall(MockAAVE.borrow, (address(debtToken), amount));
    }
}
