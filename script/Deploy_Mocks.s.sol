// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

import {LightAccountFactory} from "../src/LightAccountFactory.sol";
import {LightAccount} from "../src/LightAccount.sol";
import {MockSP} from "test/mocks/MockSP.sol";
import {MockAAVE} from "test/mocks/MockAAVE.sol";
import {MockERC20} from "solady/test/utils/mocks/MockERC20.sol";

// @notice Deploys LightAccountFactory to the address `0x00000055C0b4fA41dde26A74435ff03692292FBD`
// @dev Note: Script uses EntryPoint at address 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
// @dev To run: `forge script script/Deploy_LightAccountFactory.s.sol:Deploy_LightAccountFactory --broadcast --rpc-url ${RPC_URL} --verify -vvvv`
contract Deploy_Mocks is Script {
    function run() public {
        string memory contracts = "contracts";

        LightAccountFactory factory = LightAccountFactory(
            vm.parseJsonAddress(vm.serializeJson(contracts, vm.readFile("./out/contract-addresses.json")), ".Factory")
        );

        vm.startBroadcast();
        MockSP sp = new MockSP(factory);
        MockAAVE aave = new MockAAVE();
        MockERC20 collateralToken = new MockERC20("ERC20", "ERC20", 18);
        MockERC20 debtToken = new MockERC20("ERC20", "ERC20", 18);
        debtToken.mint(address(aave), 10 ether);
        vm.stopBroadcast();

        vm.serializeAddress(contracts, "AAVE", address(aave));
        vm.serializeAddress(contracts, "CollateralToken", address(collateralToken));
        vm.serializeAddress(contracts, "DebtToken", address(debtToken));

        string memory output = vm.serializeAddress(contracts, "SP", address(sp));
        vm.writeJson(output, "./out/contract-addresses.json");
    }
}
