export const MockSPABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "sg",
        type: "address",
        internalType: "contract LightAccountFactory",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "acquireTokens",
    inputs: [
      {
        name: "items",
        type: "tuple[]",
        internalType: "struct SpentItem[]",
        components: [
          {
            name: "itemType",
            type: "uint8",
            internalType: "enum ItemType",
          },
          {
            name: "token",
            type: "address",
            internalType: "address",
          },
          {
            name: "identifier",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "invalidSalts",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "invalidateCaveatSalt",
    inputs: [
      {
        name: "salt",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CaveatSaltInvalidated",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "salt",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InvalidItemAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidItemIdentifier",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidItemTokenNoCode",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidItemType",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidTransferLength",
    inputs: [],
  },
] as const;
