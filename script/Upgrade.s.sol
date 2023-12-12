// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

import {LightAccountFactory} from "../src/LightAccountFactory.sol";
import {LightAccount} from "../src/LightAccount.sol";
import {MockSP} from "test/mocks/MockSP.sol";
import {UpgradedLightAccount} from "test/mocks/UpgradedLightAccount.sol";
import {MockERC20} from "solady/test/utils/mocks/MockERC20.sol";
import {UUPSUpgradeable} from "solady/src/utils/UUPSUpgradeable.sol";

contract Upgrade_FactoryAndAccounts is Script {
    UUPSUpgradeable factory;
    address[] public accounts;

    function _deployAccountImplementation() internal returns (address) {
        return address(
            new UpgradedLightAccount(
                IEntryPoint(payable(0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789)), LightAccountFactory(address(factory))
            )
        );
    }

    function run() public {
        vm.startBroadcast();
        UUPSUpgradeable accountImplementation = UUPSUpgradeable(_deployAccountImplementation());
        factory.upgradeToAndCall(address(new LightAccountFactory(address(accountImplementation))), "");
        for (uint256 i = 0; i < accounts.length; i++) {
            UUPSUpgradeable(accounts[i]).upgradeToAndCall(address(accountImplementation), "");
        }
        vm.stopBroadcast();
    }
}
