import { encodeFunctionData, type Hex } from "viem";
import { LightAccountABI } from "./abi/LightAccountABI.js";
import { CallBatch } from "./CallBatch.js";

export function encodeBatchWithValidationData(
  validAfter: number,
  validUntil: number,
  callBatch: CallBatch,
): Hex {
  return encodeFunctionData({
    abi: LightAccountABI,
    functionName: "executeBatchWithValidationData",
    args: [
      packValidationData(validAfter, validUntil),
      callBatch.dest,
      callBatch.value,
      callBatch.func,
    ],
  });
}

export function packValidationData(
  validAfter: number,
  validUntil: number,
): bigint {
  return (
    (BigInt(validUntil) << BigInt(160)) |
    (BigInt(validAfter) << BigInt(160 + 48))
  );
}
