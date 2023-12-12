// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";

import {EntryPoint} from "account-abstraction/core/EntryPoint.sol";

import {UpgradedLightAccount} from "test/mocks/UpgradedLightAccount.sol";
import {SimpleAccount} from "account-abstraction/samples/SimpleAccount.sol";
import {LightAccountFactory} from "src/LightAccountFactory.sol";
import {LightAccount, IEntryPoint, CaveatFallbackTest, UserOperation} from "test/CaveatFallback.t.sol";

contract LightAccountFactoryTest is CaveatFallbackTest {
    using stdStorage for StdStorage;

    address public constant OWNER_ADDRESS = address(0x100);

    function testReturnsAddressWhenAccountAlreadyExists() public {
        LightAccount account = factory.createAccount(OWNER_ADDRESS);
        LightAccount otherAccount = factory.createAccount(OWNER_ADDRESS);
        assertEq(address(account), address(otherAccount));
    }

    function testGetAddress() public {
        address counterfactual = factory.getAddress(OWNER_ADDRESS);
        assertEq(counterfactual.codehash, bytes32(0));
        LightAccount factual = factory.createAccount(OWNER_ADDRESS);
        assertTrue(address(factual).codehash != bytes32(0));
        assertEq(counterfactual, address(factual));
    }

    function newEOA() internal {
        ++EOA_PRIVATE_KEY;
        eoaAddress = vm.addr(EOA_PRIVATE_KEY);
    }

    function testLazyDeploymentWD() public {
        newEOA();
        //deposit to entryPoint for predicted address
        address counterfactual = factory.getAddress(eoaAddress);
        vm.label(counterfactual, "counterfactual");
        entryPoint.depositTo{value: 0.02 ether}(counterfactual);

        //account still must be created to withdraw from entrypoint
        vm.prank(counterfactual);
        entryPoint.withdrawTo(payable(eoaAddress), 0.01 ether);
    }

    function testLazyDeployment() public {
        newEOA();

        //deposit to entryPoint for predicted address
        address counterfactual = factory.getAddress(eoaAddress);
        entryPoint.depositTo{value: 0.01 ether}(counterfactual);
        console.log("eoa balance", eoaAddress.balance);

        initCode = abi.encodePacked(address(factory), abi.encodeCall(factory.createAccount, (eoaAddress)));
        account = LightAccount(payable(counterfactual));

        (address[] memory dest, bytes[] memory func) = _getBatch();
        //Sign Batch Op
        UserOperation memory op = _getSignedOpBatch(dest, func, EOA_PRIVATE_KEY);

        //Bundle ops
        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = op;
        //submit op
        entryPoint.handleOps(ops, BENEFICIARY);
    }

    function testFactoryOwnerCanUpgradeFactoryImplementation() public {
        // Upgrade to a normal SimpleAccount with a different entry point.
        IEntryPoint newEntryPoint = IEntryPoint(address(0x2000));
        UpgradedLightAccount newImplementation = new UpgradedLightAccount(newEntryPoint, factory);
        address prevOwner = factory.owner();
        address newFactoryImpl = address(new LightAccountFactory(address(newImplementation)));

        vm.prank(factoryOwner);
        factory.upgradeToAndCall(newFactoryImpl, "");

        assertEq(address(factory.accountImplementation()), address(newImplementation));
        assertEq(prevOwner, factory.owner());
    }


    function testRandoCannotUpgrade() public {
        // Try to upgrade to a normal SimpleAccount with a different entry point.
        IEntryPoint newEntryPoint = IEntryPoint(address(0x2000));
        UpgradedLightAccount newImplementation = new UpgradedLightAccount(newEntryPoint, factory);
        vm.expectRevert(abi.encodeWithSelector(LightAccount.NotAuthorized.selector, address(this)));
        account.upgradeToAndCall(
            address(newImplementation), abi.encodeCall(newImplementation.initialize, address(newEntryPoint))
        );
    }
}
