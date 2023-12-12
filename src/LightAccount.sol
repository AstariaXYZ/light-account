// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";

import {LibClone} from "solady/src/utils/LibClone.sol";
import {ECDSA} from "solady/src/utils/ECDSA.sol";
import {UUPSUpgradeable} from "solady/src/utils/UUPSUpgradeable.sol";
import {SignatureCheckerLib} from "solady/src/utils/SignatureCheckerLib.sol";

import {BaseAccount} from "account-abstraction/core/BaseAccount.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {UserOperation} from "account-abstraction/interfaces/UserOperation.sol";
import {TokenCallbackHandler} from "account-abstraction/samples/callback/TokenCallbackHandler.sol";

import {CustomSlotInitializable} from "./CustomSlotInitializable.sol";
import {LightAccountFactory} from "./LightAccountFactory.sol";

import {MockSP} from "test/mocks/MockSP.sol";

/**
 * @title A simple ERC-4337 compatible smart contract account with a designated owner account
 * @dev Like eth-infinitism's `SimpleAccount`, but with the following changes:
 *
 * 1. Instead of the default storage slots, uses namespaced storage to avoid
 * clashes when switching implementations.
 *
 * 2. Ownership can be transferred via `transferOwnership`, similar to the
 * behavior of an `Ownable` contract. This is a simple single-step operation,
 * so care must be taken to ensure that the ownership is being transferred to
 * the correct address.
 *
 * 3. Supports [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271) signature
 * validation for both validating the signature on user operations and in
 * exposing its own `isValidSignature` method. This only works when the owner of
 * `LightAccount` also support ERC-1271.
 *
 * ERC-4337's bundler validation rules limit the types of contracts that can be
 * used as owners to validate user operation signatures. For example, the
 * contract's `isValidSignature` function may not use any forbidden opcodes
 * such as `TIMESTAMP` or `NUMBER`, and the contract may not be an ERC-1967
 * proxy as it accesses a constant implementation slot not associated with
 * the account, violating storage access rules. This also means that the
 * owner of a `LightAccount` may not be another `LightAccount` if you want to
 * send user operations through a bundler.
 *
 * 4. Event `SimpleAccountInitialized` renamed to `LightAccountInitialized`.
 *
 * 5. Uses custom errors.
 */
contract LightAccount is BaseAccount, TokenCallbackHandler, UUPSUpgradeable, CustomSlotInitializable, IERC1271 {
    using ECDSA for bytes32;

    // keccak256(abi.encode(uint256(keccak256("light_account_v1.storage")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 internal constant _STORAGE_POSITION = 0x691ec1a18226d004c07c9f8e5c4a6ff15a7b38db267cf7e3c945aef8be512200;
    // keccak256(abi.encode(uint256(keccak256("light_account_v1.initializable")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 internal constant _INITIALIZABLE_STORAGE_POSITION =
        0x33e4b41198cc5b8053630ed667ea7c0c4c873f7fc8d9a478b5d7259cec0a4a00;
    // bytes4(keccak256("isValidSignature(bytes32,bytes)"))
    bytes4 internal constant _1271_MAGIC_VALUE = 0x1626ba7e;
    IEntryPoint private immutable _entryPoint;
    // keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
    bytes32 private constant DOMAIN_SEPARATOR_TYPEHASH =
        0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f;
    // keccak256("LightAccountMessage(bytes message)");
    bytes32 private constant LA_MSG_TYPEHASH = 0x5e3baca2936049843f06038876a12f03627b5edc98025751ecf2ac7562640199;

    LightAccountFactory public immutable factory;

    struct LightAccountStorage {
        address owner;
    }

    /**
     * @dev The length of the array does not match the expected length.
     */
    error ArrayLengthMismatch();

    /**
     * @dev The caller is not authorized.
     */
    error NotAuthorized(address caller);

    /**
     * @dev The salt is invalid, the caveat was filled or manually invalidated.
     */
    error InvalidSalt();

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    constructor(IEntryPoint anEntryPoint, address factoryOwner)
        CustomSlotInitializable(_INITIALIZABLE_STORAGE_POSITION)
    {
        _entryPoint = anEntryPoint;
        (, address factoryAddr) =
            LibClone.createDeterministicERC1967(0, address(new LightAccountFactory(address(this))), bytes32(0));
        factory = LightAccountFactory(factoryAddr);
        factory.initialize(factoryOwner);
        _disableInitializers();
    }

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    /**
     * @notice Execute a transaction. This may only be called directly by the
     * owner or by the entry point via a user operation signed by the owner.
     * @param dest The target of the transaction
     * @param value The amount of wei sent in the transaction
     * @param func The transaction's calldata
     */
    function execute(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
    }

    /**
     * @notice Execute a sequence of transactions
     * @param dest An array of the targets for each transaction in the sequence
     * @param func An array of calldata for each transaction in the sequence.
     * Must be the same length as dest, with corresponding elements representing
     * the parameters for each transaction.
     */
    function executeBatch(address[] calldata dest, bytes[] calldata func) external {
        _requireFromEntryPointOrOwner();
        if (dest.length != func.length) {
            revert ArrayLengthMismatch();
        }
        uint256 length = dest.length;
        for (uint256 i = 0; i < length;) {
            _call(dest[i], 0, func[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Execute a sequence of transactions
     * @param dest An array of the targets for each transaction in the sequence
     * @param value An array of value for each transaction in the sequence
     * @param func An array of calldata for each transaction in the sequence.
     * Must be the same length as dest, with corresponding elements representing
     * the parameters for each transaction.
     */
    function executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func) external {
        _requireFromEntryPointOrOwner();
        if (dest.length != func.length || dest.length != value.length) {
            revert ArrayLengthMismatch();
        }
        uint256 length = dest.length;
        for (uint256 i = 0; i < length;) {
            _call(dest[i], value[i], func[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Execute a sequence of transactions
     * @param validationData validationData to return from validateUserOp
     * @param dest An array of the targets for each transaction in the sequence
     * @param value An array of value for each transaction in the sequence
     * @param func An array of calldata for each transaction in the sequence.
     * Must be the same length as dest, with corresponding elements representing
     * the parameters for each transaction.
     */
    function executeBatchWithValidationData(
        uint256 validationData,
        address[] calldata dest,
        uint256[] calldata value,
        bytes[] calldata func
    ) external {
        (validationData);
        _onlyEntryPoint();
        if (dest.length != func.length || dest.length != value.length) {
            revert ArrayLengthMismatch();
        }
        uint256 length = dest.length;
        for (uint256 i = 0; i < length;) {
            _call(dest[i], value[i], func[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Called to validate the salt before executing the remainder of the user operation.
     * @dev This function can be used to ensure a caveat has not been filled for the owner,
     * during execution, by adding it to a batch operation.
     * @param sp The SP contract to validate against
     * @param salt The salt to validate
     */
    function isValidSalt(MockSP sp, bytes32 salt) external view {
        if (MockSP(sp).invalidSalts(owner(), salt)) {
            revert InvalidSalt();
        }
    }

    /**
     * @notice Called once as part of initialization, either during initial deployment or when first upgrading to
     * this contract.
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
     * a new implementation of LightAccount must be deployed with the new EntryPoint address, then upgrading
     * the implementation by calling `upgradeTo()`
     * @param _owner The address that owns this account
     */
    function initialize(address _owner) public virtual initializer {
        _initialize(_owner);
    }

    /// @inheritdoc UUPSUpgradeable
    function _authorizeUpgrade(address) internal virtual override {
        if (msg.sender != factory.owner()) {
            revert NotAuthorized(msg.sender);
        }
    }

    /**
     * @notice Deposit more funds for this account in the entryPoint
     */
    function addDeposit() public payable {
        entryPoint().depositTo{value: msg.value}(address(this));
    }

    /**
     * @notice Withdraw value from the account's deposit
     * @param withdrawAddress Target to send to
     * @param amount Amount to withdraw
     */
    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    /**
     * @notice Return the current owner of this account
     * @return The current owner
     */
    function owner() public view returns (address) {
        return _getStorage().owner;
    }

    /**
     * @notice Check current account deposit in the entryPoint
     * @return The current account deposit
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * @notice Returns the domain separator for this contract, as defined in the EIP-712 standard.
     * @return bytes32 The domain separator hash.
     */
    function domainSeparator() public view returns (bytes32) {
        return keccak256(
            abi.encode(
                DOMAIN_SEPARATOR_TYPEHASH,
                abi.encode("LightAccount"), // name
                abi.encode("1"), // version
                block.chainid, // chainId
                address(this) // verifying contract
            )
        );
    }

    /**
     * @notice Returns the pre-image of the message hash
     * @param message Message that should be encoded.
     * @return Encoded message.
     */
    function encodeMessageData(bytes memory message) public view returns (bytes memory) {
        bytes32 messageHash = keccak256(abi.encode(LA_MSG_TYPEHASH, keccak256(message)));
        return abi.encodePacked("\x19\x01", domainSeparator(), messageHash);
    }

    /**
     * @notice Returns hash of a message that can be signed by owners.
     * @param message Message that should be hashed.
     * @return Message hash.
     */
    function getMessageHash(bytes memory message) public view returns (bytes32) {
        return keccak256(encodeMessageData(message));
    }

    /**
     * @dev The signature is valid if it is signed by the owner's private key
     * (if the owner is an EOA) or if it is a valid ERC-1271 signature from the
     * owner (if the owner is a contract).
     */
    function isValidSignature(bytes32 digest, bytes calldata signature) public view override returns (bytes4) {
        bytes memory messageData = encodeMessageData(abi.encode(digest));
        bytes32 messageHash = keccak256(messageData);
        if (SignatureCheckerLib.isValidSignatureNowCalldata(owner(), messageHash, signature)) {
            return _1271_MAGIC_VALUE;
        }
        return 0xffffffff;
    }

    function _initialize(address _owner) internal virtual {
        _getStorage().owner = _owner;
    }

    /*
     * Implement template method of BaseAccount.
     *
     * Uses a modified version of `SignatureChecker.isValidSignatureNow` in
     * which the digest is wrapped with an "Ethereum Signed Message" envelope
     * for the EOA-owner case but not in the ERC-1271 contract-owner case.
     */
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
        internal
        virtual
        override
        returns (uint256 validationData)
    {
        bytes4 fnSelector = bytes4(userOp.callData[0:4]);
        if (fnSelector == this.executeBatchWithValidationData.selector) {
            validationData = uint256(bytes32(userOp.callData[4:36]));
        }

        bytes calldata signature = userOp.signature;
        (address recovered) = userOpHash.toEthSignedMessageHash().tryRecover(signature);

        address _owner = owner();
        if (
            (recovered != address(0) && recovered == _owner)
                || SignatureCheckerLib.isValidERC1271SignatureNowCalldata(_owner, userOpHash, signature)
        ) {
            return validationData;
        }
        return SIG_VALIDATION_FAILED;
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the account itself (which gets redirected through execute())
        if (msg.sender != address(this) && msg.sender != owner()) {
            revert NotAuthorized(msg.sender);
        }
    }

    function _onlyEntryPoint() internal view {
        if (msg.sender != address(entryPoint())) {
            revert NotAuthorized(msg.sender);
        }
    }

    // Require the function call went through EntryPoint or owner
    function _requireFromEntryPointOrOwner() internal view {
        if (msg.sender != address(entryPoint()) && msg.sender != owner()) {
            revert NotAuthorized(msg.sender);
        }
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function _getStorage() internal pure returns (LightAccountStorage storage storageStruct) {
        assembly {
            storageStruct.slot := _STORAGE_POSITION
        }
    }
}
