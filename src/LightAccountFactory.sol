// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {UUPSUpgradeable} from "solady/src/utils/UUPSUpgradeable.sol";
import {LibClone} from "solady/src/utils/LibClone.sol";
import {Ownable} from "solady/src/auth/Ownable.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {LightAccount} from "./LightAccount.sol";

/**
 * @title A factory contract for LightAccount
 * @dev A UserOperations "initCode" holds the address of the factory, and a method call (to createAccount, in this sample factory).
 * The factory's createAccount returns the target account address even if it is already installed.
 * This way, the entryPoint.getSenderAddress() can be called either before or after the account is created.
 */
contract LightAccountFactory is Ownable, UUPSUpgradeable {
    /**
     * @dev The new owner is not a valid owner (e.g., `address(0)`, the
     * account itself, or the current owner).
     */
    error InvalidOwner(address owner);

    error WithdrawFailed();

    address public immutable accountImplementation;
    mapping(address => address) public accountOwner;

    constructor(address _accountImplementation) {
        accountImplementation = _accountImplementation;
        _disableOwnableInitializer();
    }

    function _disableOwnableInitializer() internal {
        _initializeOwner(address(bytes20(keccak256("ownable.disable-initializer"))));
    }

    function initialize(address _owner) public virtual {
        _initializeOwner(_owner);
    }

    /**
     * @notice Create an account, and return its address.
     * Returns the address even if the account is already deployed.
     * @dev During UserOperation execution, this method is called only if the account is not deployed.
     * This method returns an existing account address so that entryPoint.getSenderAddress() would work even after account creation.
     * @param owner The owner of the account to be created
     * @return ret The address of either the newly deployed account or an existing account with this owner and salt
     */
    function createAccount(address owner) external payable returns (LightAccount ret) {
        if (owner == address(0)) {
            revert InvalidOwner(owner);
        }

        (bool alreadyDeployed, address account) =
            LibClone.createDeterministicERC1967(msg.value, accountImplementation, bytes32(bytes20(owner)));

        ret = LightAccount(payable(account));

        if (!alreadyDeployed) {
            accountOwner[account] = owner;
            assembly ("memory-safe") {
                mstore(0x14, owner) // Store the `owner` argument.
                mstore(0x00, 0xc4d66de8000000000000000000000000) // `initialize(address)`.
                if iszero(call(gas(), account, 0, 0x10, 0x24, codesize(), 0x00)) {
                    returndatacopy(mload(0x40), 0x00, returndatasize())
                    revert(mload(0x40), returndatasize())
                }
            }
        }
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /**
     * @notice Calculate the counterfactual address of this account as it would be returned by createAccount()
     * @param owner The owner of the account to be created
     * @return The address of the account that would be created with createAccount()
     */
    function getAddress(address owner) public view returns (address) {
        return LibClone.predictDeterministicAddressERC1967(accountImplementation, bytes32(bytes20(owner)), address(this));
    }

    function addStakeTo(IEntryPoint entryPoint, uint32 unstakeDelaySec) external payable onlyOwner {
        entryPoint.addStake{value: msg.value}(unstakeDelaySec);
    }

    function unlockStakeFrom(IEntryPoint entryPoint) external onlyOwner {
        entryPoint.unlockStake();
    }

    function withdrawStakeFrom(IEntryPoint entryPoint, address payable withdrawAddress) external onlyOwner {
        entryPoint.withdrawStake(withdrawAddress);
    }
}
