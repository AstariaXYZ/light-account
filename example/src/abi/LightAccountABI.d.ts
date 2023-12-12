export declare const LightAccountABI: readonly [
  {
    readonly type: "constructor";
    readonly inputs: readonly [
      {
        readonly name: "anEntryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
      },
    ];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "receive";
    readonly stateMutability: "payable";
  },
  {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
  },
  {
    readonly type: "function";
    readonly name: "domainSeparator";
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "encodeMessageData";
    readonly inputs: readonly [
      {
        readonly name: "message";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [
      {
        readonly name: "dest";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "value";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
      {
        readonly name: "func";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "executeBatch";
    readonly inputs: readonly [
      {
        readonly name: "dest";
        readonly type: "address[]";
        readonly internalType: "address[]";
      },
      {
        readonly name: "func";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "executeBatch";
    readonly inputs: readonly [
      {
        readonly name: "dest";
        readonly type: "address[]";
        readonly internalType: "address[]";
      },
      {
        readonly name: "value";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
      },
      {
        readonly name: "func";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "executeBatchWithValidationData";
    readonly inputs: readonly [
      {
        readonly name: "validationData";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
      {
        readonly name: "dest";
        readonly type: "address[]";
        readonly internalType: "address[]";
      },
      {
        readonly name: "value";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
      },
      {
        readonly name: "func";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "getMessageHash";
    readonly inputs: readonly [
      {
        readonly name: "message";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [
      {
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "isValidSalt";
    readonly inputs: readonly [
      {
        readonly name: "sp";
        readonly type: "address";
        readonly internalType: "contract MockSP";
      },
      {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [
      {
        readonly name: "digest";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
      },
      {
        readonly name: "signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
      },
      {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
      },
      {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
      },
    ];
    readonly stateMutability: "pure";
  },
  {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
      {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
      {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
      },
    ];
    readonly stateMutability: "pure";
  },
  {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
      {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
      },
    ];
    readonly stateMutability: "pure";
  },
  {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [
      {
        readonly name: "interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "tokensReceived";
    readonly inputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
      {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
      {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "pure";
  },
  {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [
      {
        readonly name: "userOp";
        readonly type: "tuple";
        readonly internalType: "struct UserOperation";
        readonly components: readonly [
          {
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
          },
          {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
          },
          {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
          },
          {
            readonly name: "callGasLimit";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "verificationGasLimit";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "maxFeePerGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "maxPriorityFeePerGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
          },
          {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
          },
        ];
      },
      {
        readonly name: "userOpHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
      },
      {
        readonly name: "missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "validationData";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
    ];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "withdrawDepositTo";
    readonly inputs: readonly [
      {
        readonly name: "withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
      },
      {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [
      {
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "LightAccountInitialized";
    readonly inputs: readonly [
      {
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "contract IEntryPoint";
      },
      {
        readonly name: "owner";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "error";
    readonly name: "ArrayLengthMismatch";
    readonly inputs: readonly [];
  },
  {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
  },
  {
    readonly type: "error";
    readonly name: "InvalidSalt";
    readonly inputs: readonly [];
  },
  {
    readonly type: "error";
    readonly name: "NotAuthorized";
    readonly inputs: readonly [
      {
        readonly name: "caller";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
  },
  {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
  },
];
