import { CallBatch } from "./CallBatch.js";
import { LightAccountABI } from "./abi/LightAccountABI.js";
import { MockAAVEABI } from "./abi/MockAAVEABI.js";
import { MockSPABI } from "./abi/MockSPABI.js";
import { Erc20ABI } from "./abi/Erc20ABI.js";
import { pad } from "viem";

import { encodeFunctionData, type Address, type Hex } from "viem";

export type BaseFallBackConfig = {
  account: Address;
  salt: Hex;
  sp: Address;
};
export type AaveFallBackConfig = BaseFallBackConfig & {
  aave: Address;
  collateralToken: Address;
  collateralAmount: bigint;
  debtToken: Address;
  debtAmount: bigint;
};

export function getAaveFallbackCallBatch(
  config: AaveFallBackConfig,
): CallBatch {
  const callBatch = new CallBatch();
  const {
    account,
    salt,
    sp,
    collateralToken,
    collateralAmount,
    debtToken,
    debtAmount,
    aave,
  } = config;

  //1. Validate caveat salt
  callBatch.push({
    dest: account,
    value: BigInt(0),
    func: encodeFunctionData({
      abi: LightAccountABI,
      functionName: "isValidSalt",
      args: [sp, pad(salt, { size: 32 })],
    }),
  });

  //2. Withdraw asset using sp approval
  callBatch.push({
    dest: sp,
    value: BigInt(0),
    func: encodeFunctionData({
      abi: MockSPABI,
      functionName: "acquireTokens",
      args: [
        [
          {
            itemType: 1,
            token: collateralToken,
            identifier: BigInt(0),
            amount: collateralAmount,
          },
        ],
      ],
    }),
  });

  //3. Approve asset to destination
  callBatch.push({
    dest: collateralToken,
    value: BigInt(0),
    func: encodeFunctionData({
      abi: Erc20ABI,
      functionName: "approve",
      args: [aave, collateralAmount],
    }),
  });

  //4. Supply
  callBatch.push({
    dest: aave,
    value: BigInt(0),
    func: encodeFunctionData({
      abi: MockAAVEABI,
      functionName: "supply",
      args: [collateralToken, collateralAmount],
    }),
  });

  //5. Borrow
  callBatch.push({
    dest: aave,
    value: BigInt(0),
    func: encodeFunctionData({
      abi: MockAAVEABI,
      functionName: "borrow",
      args: [debtToken, debtAmount],
    }),
  });
  return callBatch;
}
