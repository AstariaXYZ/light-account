export declare const MockAAVEABI: readonly [
  {
    readonly type: "function";
    readonly name: "borrow";
    readonly inputs: readonly [
      {
        readonly name: "token";
        readonly type: "address";
        readonly internalType: "address";
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
    readonly type: "function";
    readonly name: "supply";
    readonly inputs: readonly [
      {
        readonly name: "token";
        readonly type: "address";
        readonly internalType: "address";
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
];
