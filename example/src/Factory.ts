import {
  encodeFunctionData,
  type Address,
  type Hex,
  isAddress,
  concat,
  PublicClient,
  decodeAbiParameters,
} from "viem";
import { LightAccountFactoryABI } from "./abi/LightAccountFactoryABI.js";
import { UserOperation } from "./UserOperation.js";

export async function getCounterfactualAddress(
  publicClient: PublicClient,
  owner: Address,
  factory: Address,
): Promise<Address> {
  const response = await publicClient.call({
    to: factory,
    data: encodeFunctionData({
      abi: LightAccountFactoryABI,
      functionName: "getAddress",
      args: [owner],
    }),
  });

  return decodeAbiParameters(
    [{ type: "address" }],
    response.data as Hex,
  )[0] as Address;
}

export async function enableLazyDeployment(
  publicClient: PublicClient,
  operation: UserOperation,
  owner: Address,
  factory: Address,
) {
  operation.sender = await getCounterfactualAddress(
    publicClient,
    owner,
    factory,
  );
  operation.initCode = concat([
    factory,
    encodeFunctionData({
      abi: LightAccountFactoryABI,
      functionName: "createAccount",
      args: [owner],
    }),
  ]) as Hex;
}
