export declare const EntryPointABI: readonly [
  {
    readonly type: "receive";
    readonly stateMutability: "payable";
  },
  {
    readonly type: "function";
    readonly name: "SIG_VALIDATION_FAILED";
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
    readonly name: "addStake";
    readonly inputs: readonly [
      {
        readonly name: "unstakeDelaySec";
        readonly type: "uint32";
        readonly internalType: "uint32";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
  },
  {
    readonly type: "function";
    readonly name: "balanceOf";
    readonly inputs: readonly [
      {
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
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
    readonly name: "depositTo";
    readonly inputs: readonly [
      {
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
  },
  {
    readonly type: "function";
    readonly name: "deposits";
    readonly inputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "deposit";
        readonly type: "uint112";
        readonly internalType: "uint112";
      },
      {
        readonly name: "staked";
        readonly type: "bool";
        readonly internalType: "bool";
      },
      {
        readonly name: "stake";
        readonly type: "uint112";
        readonly internalType: "uint112";
      },
      {
        readonly name: "unstakeDelaySec";
        readonly type: "uint32";
        readonly internalType: "uint32";
      },
      {
        readonly name: "withdrawTime";
        readonly type: "uint48";
        readonly internalType: "uint48";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "getDepositInfo";
    readonly inputs: readonly [
      {
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "info";
        readonly type: "tuple";
        readonly internalType: "struct IStakeManager.DepositInfo";
        readonly components: readonly [
          {
            readonly name: "deposit";
            readonly type: "uint112";
            readonly internalType: "uint112";
          },
          {
            readonly name: "staked";
            readonly type: "bool";
            readonly internalType: "bool";
          },
          {
            readonly name: "stake";
            readonly type: "uint112";
            readonly internalType: "uint112";
          },
          {
            readonly name: "unstakeDelaySec";
            readonly type: "uint32";
            readonly internalType: "uint32";
          },
          {
            readonly name: "withdrawTime";
            readonly type: "uint48";
            readonly internalType: "uint48";
          },
        ];
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [
      {
        readonly name: "sender";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "key";
        readonly type: "uint192";
        readonly internalType: "uint192";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "nonce";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
    ];
    readonly stateMutability: "view";
  },
  {
    readonly type: "function";
    readonly name: "getSenderAddress";
    readonly inputs: readonly [
      {
        readonly name: "initCode";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "getUserOpHash";
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
    readonly name: "handleAggregatedOps";
    readonly inputs: readonly [
      {
        readonly name: "opsPerAggregator";
        readonly type: "tuple[]";
        readonly internalType: "struct IEntryPoint.UserOpsPerAggregator[]";
        readonly components: readonly [
          {
            readonly name: "userOps";
            readonly type: "tuple[]";
            readonly internalType: "struct UserOperation[]";
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
            readonly name: "aggregator";
            readonly type: "address";
            readonly internalType: "contract IAggregator";
          },
          {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
          },
        ];
      },
      {
        readonly name: "beneficiary";
        readonly type: "address";
        readonly internalType: "address payable";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "handleOps";
    readonly inputs: readonly [
      {
        readonly name: "ops";
        readonly type: "tuple[]";
        readonly internalType: "struct UserOperation[]";
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
        readonly name: "beneficiary";
        readonly type: "address";
        readonly internalType: "address payable";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "incrementNonce";
    readonly inputs: readonly [
      {
        readonly name: "key";
        readonly type: "uint192";
        readonly internalType: "uint192";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "innerHandleOp";
    readonly inputs: readonly [
      {
        readonly name: "callData";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
      {
        readonly name: "opInfo";
        readonly type: "tuple";
        readonly internalType: "struct EntryPoint.UserOpInfo";
        readonly components: readonly [
          {
            readonly name: "mUserOp";
            readonly type: "tuple";
            readonly internalType: "struct EntryPoint.MemoryUserOp";
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
                readonly name: "paymaster";
                readonly type: "address";
                readonly internalType: "address";
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
            ];
          },
          {
            readonly name: "userOpHash";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
          },
          {
            readonly name: "prefund";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "contextOffset";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "preOpGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
        ];
      },
      {
        readonly name: "context";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: "actualGasCost";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
    ];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "nonceSequenceNumber";
    readonly inputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "uint192";
        readonly internalType: "uint192";
      },
    ];
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
    readonly name: "unlockStake";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "withdrawStake";
    readonly inputs: readonly [
      {
        readonly name: "withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "withdrawTo";
    readonly inputs: readonly [
      {
        readonly name: "withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
      },
      {
        readonly name: "withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "event";
    readonly name: "AccountDeployed";
    readonly inputs: readonly [
      {
        readonly name: "userOpHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
      },
      {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "factory";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
      },
      {
        readonly name: "paymaster";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "BeforeExecution";
    readonly inputs: readonly [];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "Deposited";
    readonly inputs: readonly [
      {
        readonly name: "account";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "totalDeposit";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "PostOpRevertReason";
    readonly inputs: readonly [
      {
        readonly name: "userOpHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
      },
      {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "nonce";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
      {
        readonly name: "revertReason";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "SignatureAggregatorChanged";
    readonly inputs: readonly [
      {
        readonly name: "aggregator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "StakeLocked";
    readonly inputs: readonly [
      {
        readonly name: "account";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "totalStaked";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
      {
        readonly name: "unstakeDelaySec";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "StakeUnlocked";
    readonly inputs: readonly [
      {
        readonly name: "account";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "withdrawTime";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "StakeWithdrawn";
    readonly inputs: readonly [
      {
        readonly name: "account";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "withdrawAddress";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
      },
      {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "UserOperationEvent";
    readonly inputs: readonly [
      {
        readonly name: "userOpHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
      },
      {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "paymaster";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "nonce";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
      {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
      },
      {
        readonly name: "actualGasCost";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
      {
        readonly name: "actualGasUsed";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "UserOperationRevertReason";
    readonly inputs: readonly [
      {
        readonly name: "userOpHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
      },
      {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "nonce";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
      {
        readonly name: "revertReason";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "event";
    readonly name: "Withdrawn";
    readonly inputs: readonly [
      {
        readonly name: "account";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
      },
      {
        readonly name: "withdrawAddress";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
      },
      {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "error";
    readonly name: "FailedOp";
    readonly inputs: readonly [
      {
        readonly name: "opIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
      },
      {
        readonly name: "reason";
        readonly type: "string";
        readonly internalType: "string";
      },
    ];
  },
  {
    readonly type: "error";
    readonly name: "PostOpReverted";
    readonly inputs: readonly [
      {
        readonly name: "returnData";
        readonly type: "bytes";
        readonly internalType: "bytes";
      },
    ];
  },
  {
    readonly type: "error";
    readonly name: "SenderAddressResult";
    readonly inputs: readonly [
      {
        readonly name: "sender";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
  },
  {
    readonly type: "error";
    readonly name: "SignatureValidationFailed";
    readonly inputs: readonly [
      {
        readonly name: "aggregator";
        readonly type: "address";
        readonly internalType: "address";
      },
    ];
  },
];
