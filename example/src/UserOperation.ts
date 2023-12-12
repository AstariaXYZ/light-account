import {
  type Address,
  type Hex,
  type PrivateKeyAccount,
  encodeAbiParameters,
  keccak256,
  hashMessage,
  Chain,
} from "viem";

export type UserOperation = {
  sender: Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  signature: Hex;
  paymasterAndData: Hex;
};

function packOp(operation: UserOperation): Hex {
  const {
    sender,
    nonce,
    callGasLimit,
    verificationGasLimit,
    preVerificationGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    paymasterAndData,
    initCode,
    callData,
  } = operation;

  return encodeAbiParameters(
    [
      { name: "sender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "hashInitCode", type: "bytes32" },
      { name: "hashCallData", type: "bytes32" },
      { name: "callGasLimit", type: "uint256" },
      { name: "verificationGasLimit", type: "uint256" },
      { name: "preVerificationGasLimit", type: "uint256" },
      { name: "maxFeePerGas", type: "uint256" },
      { name: "maxPriorityFeePerGas", type: "uint256" },
      { name: "hashPaymasterAndData", type: "bytes32" },
    ],

    [
      sender,
      nonce,
      keccak256(initCode),
      keccak256(callData),
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      keccak256(paymasterAndData),
    ],
  );
}

/**
 * Hash the user operation data.
 * @param userOp - The user operation data.
 */
export function getUserOpHash(
  operation: UserOperation,
  entryPoint: Address,
  chain: Chain,
): Hex {
  return keccak256(
    encodeAbiParameters(
      [
        { name: "opHash", type: "bytes32" },
        { name: "entryPoint", type: "address" },
        { name: "chainId", type: "uint256" },
      ],
      [keccak256(packOp(operation)), entryPoint, BigInt(chain.id)],
    ),
  );
}

export async function signUserOperation(
  operation: UserOperation,
  account: PrivateKeyAccount,
  entryPoint: Address,
  chain: Chain,
) {
  console.log(getUserOpHash(operation, entryPoint, chain));
  console.log(hashMessage(getUserOpHash(operation, entryPoint, chain)));
  operation.signature = await account.signMessage({
    message: { raw: getUserOpHash(operation, entryPoint, chain) },
  });
}
