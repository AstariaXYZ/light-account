// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC721} from "solady/src/tokens/ERC721.sol";
import {ERC20} from "solady/src/tokens/ERC20.sol";
import {ERC1155} from "solady/src/tokens/ERC1155.sol";
import {ItemType, SpentItem} from "seaport-types/lib/ConsiderationStructs.sol";
import {SafeTransferLib} from "solady/src/utils/SafeTransferLib.sol";
import {LightAccount} from "src/LightAccount.sol";
import {LightAccountFactory} from "src/LightAccountFactory.sol";

//TODO: update to use Stargate factory registry w/ 1:1 addresses
contract MockSP {
    mapping(address => mapping(bytes32 => bool)) public invalidSalts;
    LightAccountFactory SG;

    error InvalidItemType();
    error InvalidItemAmount();
    error InvalidItemTokenNoCode();
    error InvalidItemIdentifier(); // Must be zero for ERC20's
    error InvalidTransferLength();

    event CaveatSaltInvalidated(address owner, bytes32 salt);

    constructor(LightAccountFactory sg) {
        SG = sg;
    }

    /**
     * @dev Invalidates a caveat salt
     * @param salt The salt to invalidate
     */

    function invalidateCaveatSalt(bytes32 salt) external {
        if (invalidSalts[msg.sender][salt]) {
            revert("Salt already invalidated");
        }
        invalidSalts[msg.sender][salt] = true;
        emit CaveatSaltInvalidated(msg.sender, salt);
    }

    function acquireTokens(SpentItem[] memory items) external {
        transferSpentItems(items, SG.accountOwner(msg.sender), msg.sender, false);
    }

    function transferSpentItems(SpentItem[] memory transfers, address from, address to, bool safe) internal {
        if (transfers.length > 0) {
            uint256 i = 0;
            for (; i < transfers.length;) {
                SpentItem memory transfer = transfers[i];
                _transferItem(transfer.itemType, transfer.token, transfer.identifier, transfer.amount, from, to, safe);
                unchecked {
                    ++i;
                }
            }
        } else {
            revert InvalidTransferLength();
        }
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*               PRIVATE INTERNAL FUNCTIONS                   */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    function _transferItem(
        ItemType itemType,
        address token,
        uint256 identifier,
        uint256 amount,
        address from,
        address to,
        bool safe
    ) internal {
        if (token.code.length == 0) {
            revert InvalidItemTokenNoCode();
        }
        if (itemType == ItemType.ERC20) {
            if (identifier > 0 && safe) {
                revert InvalidItemIdentifier();
            }
            if (amount == 0 && safe) {
                revert InvalidItemAmount();
            }
            SafeTransferLib.safeTransferFrom(token, from, to, amount);
        } else if (itemType == ItemType.ERC721) {
            if (amount != 1 && safe) {
                revert InvalidItemAmount();
            }
            // erc721 transfer
            ERC721(token).transferFrom(from, to, identifier);
        } else if (itemType == ItemType.ERC1155) {
            if (amount == 0 && safe) {
                revert InvalidItemAmount();
            }
            // erc1155 transfer
            ERC1155(token).safeTransferFrom(from, to, identifier, amount, new bytes(0));
        } else {
            revert InvalidItemType();
        }
    }
}
