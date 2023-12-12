export declare const MockSPABI: readonly [
  {
    readonly type: "constructor";
    readonly inputs: readonly [
      {
        readonly name: "sg";
        readonly type: "address";
        readonly internalType: "contract LightAccountFactory";
      },
    ];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "acquireTokens";
    readonly inputs: readonly [
      {
        readonly name: "items";
        readonly type: "tuple[]";
        readonly internalType: "struct SpentItem[]";
        readonly components: readonly [
          {
            readonly name: "itemType";
            readonly type: "uint8";
            readonly internalType: "enum ItemType";
          },
          {
            readonly name: "token";
            readonly type: "address";
            readonly internalType: "address";
          },
          {
            readonly name: "identifier";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
          {
            readonly name: "amount";
            readonly type: "uint256";
            readonly internalType: "uint256";
          },
        ];
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "function";
    readonly name: "invalidSalts";
    readonly inputs: readonly [
      {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
      },
      {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
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
    readonly name: "invalidateCaveatSalt";
    readonly inputs: readonly [
      {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
  },
  {
    readonly type: "event";
    readonly name: "CaveatSaltInvalidated";
    readonly inputs: readonly [
      {
        readonly name: "owner";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
      },
      {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly indexed: false;
        readonly internalType: "bytes32";
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: "error";
    readonly name: "InvalidItemAmount";
    readonly inputs: readonly [];
  },
  {
    readonly type: "error";
    readonly name: "InvalidItemIdentifier";
    readonly inputs: readonly [];
  },
  {
    readonly type: "error";
    readonly name: "InvalidItemTokenNoCode";
    readonly inputs: readonly [];
  },
  {
    readonly type: "error";
    readonly name: "InvalidItemType";
    readonly inputs: readonly [];
  },
  {
    readonly type: "error";
    readonly name: "InvalidTransferLength";
    readonly inputs: readonly [];
  },
];
