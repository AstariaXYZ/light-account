// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

import {LightAccount} from "src/LightAccount.sol";
import {LibClone} from "solady/src/utils/LibClone.sol";
import {LightAccountFactory} from "src/LightAccountFactory.sol";

// @notice Deploys LightAccountFactory to the address `0x00000055C0b4fA41dde26A74435ff03692292FBD`
// @dev Note: Script uses EntryPoint at address 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
// @dev To run: `forge script script/Deploy_LightAccountFactory.s.sol:Deploy_LightAccountFactory --broadcast --rpc-url ${RPC_URL} --verify -vvvv`
contract Deploy_LightAccountFactory is Script {
    address public factoryOwner;
    LightAccount implementation;
    LightAccountFactory factory;

    function run() public virtual {
        // Using entryPoint: 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
        // Correct as of Oct 3 2023, from https://docs.alchemy.com/reference/eth-supportedentrypoints
        IEntryPoint entryPoint = IEntryPoint(payable(0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789));

        vm.startBroadcast();
        console.log("********************************");
        console.log("******** Deploy Inputs *********");
        console.log("********************************");

        console.log("Entrypoint Address is:");
        console.logAddress(address(entryPoint));

        factoryOwner = factoryOwner != address(0) ? factoryOwner : msg.sender;
        console.log("Factory Owner Address is:");
        console.logAddress(factoryOwner);

        console.log("********************************");
        console.log("******** Deploy ...... *********");
        console.log("********************************");

        implementation = new LightAccount(entryPoint, factoryOwner);
        factory = implementation.factory();
        factory.addStakeTo{value: 0.1 ether}(entryPoint, 1 days);

        vm.stopBroadcast();

        assert(factory.owner() == factoryOwner);

        string memory contracts = "contracts";

        vm.serializeAddress(contracts, "Factory", address(factory));
        string memory output = vm.serializeAddress(contracts, "AccountImplementation", address(implementation));
        vm.writeJson(output, "./out/contract-addresses.json");
    }
}
