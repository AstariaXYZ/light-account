// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

import {LightAccount} from "src/LightAccount.sol";
import {LightAccountFactory} from "src/LightAccountFactory.sol";
import {MockSP} from "test/mocks/MockSP.sol";
import {MockAAVE} from "test/mocks/MockAAVE.sol";
import {MockERC20} from "solady/test/utils/mocks/MockERC20.sol";
import {UUPSUpgradeable} from "solady/src/utils/UUPSUpgradeable.sol";

contract UpgradedLightAccount is UUPSUpgradeable {
    LightAccountFactory public immutable factory;
    IEntryPoint public immutable entryPoint;

    // keccak256(abi.encode(uint256(keccak256("light_account_v1.storage")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 internal constant _STORAGE_POSITION = 0x691ec1a18226d004c07c9f8e5c4a6ff15a7b38db267cf7e3c945aef8be512200;

    struct LightAccountStorage {
        address owner;
    }

    constructor(IEntryPoint _anEntryPoint, LightAccountFactory _factory) {
        entryPoint = _anEntryPoint;
        factory = _factory;
    }

    function _authorizeUpgrade(address) internal virtual override {
        if (msg.sender != factory.owner()) {
            revert();
        }
    }

    function initialize(address _owner) public virtual {}


    function _getStorage() internal pure returns (LightAccountStorage storage storageStruct) {
        assembly {
            storageStruct.slot := _STORAGE_POSITION
        }
    }

    /**
     * @notice Return the current owner of this account
     * @return The current owner
     */
    function owner() public view returns (address) {
        return _getStorage().owner;
    }
}
