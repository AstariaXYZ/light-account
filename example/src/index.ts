import { sepolia } from "viem/chains";
import {
  type Address,
  type Hex,
  http,
  createWalletClient,
  createPublicClient,
  publicActions,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import fs from "node:fs";
import { getAaveFallbackCallBatch } from "./FallBack.js";
import { UserOperation, signUserOperation } from "./UserOperation.js";
import { createAAProvider } from "./AAProvider.js";
import { encodeBatchWithValidationData } from "./Account.js";
import { enableLazyDeployment, getCounterfactualAddress } from "./Factory.js";
import { EntryPointABI } from "./abi/EntryPointABI.js";
import { Erc20ABI } from "./abi/Erc20ABI.js";

//Config
const chain = sepolia;
const alchemyUrl = "https://eth-sepolia.g.alchemy.com/...";
// The private key of your EOA that will be the owner of Light Account
const PRIVATE_KEY =  "0x..." as Hex;
const doSetup = false;



const CONTRACTS = JSON.parse(
  fs.readFileSync("../out/contract-addresses.json").toString(),
);
const owner = privateKeyToAccount(PRIVATE_KEY);
const factory = CONTRACTS.Factory as Address;
const sp = CONTRACTS.SP as Address;
const aave = CONTRACTS.AAVE as Address;
const collateralToken = CONTRACTS.CollateralToken as Address;
const debtToken = CONTRACTS.DebtToken as Address;
const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as Address;


await (async () => {
  if (doSetup) await setup();

  const client = createPublicClient({
    transport: http(alchemyUrl),
    chain,
  });

  const operation: UserOperation = {
    sender: await getCounterfactualAddress(client, owner.address, factory),
    nonce: BigInt(2),
    callData: "0x",
    initCode: "0x",
    callGasLimit: BigInt(0),
    verificationGasLimit: BigInt(0),
    preVerificationGas: BigInt(0),
    maxFeePerGas: (await client.estimateFeesPerGas()).maxFeePerGas ?? BigInt(0),
    maxPriorityFeePerGas: BigInt(0),
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c", //dummy signature, for accurate estimates
    paymasterAndData: "0x",
  };

  //if account has not been created yet, enable lazy deployment
  if (
    ((await client.getBytecode({ address: operation.sender })) ?? "").length ==
    0
  ) {
    console.log("Enabling lazy deployment");
    await enableLazyDeployment(client, operation, owner.address, factory);
  }

  operation.callData = encodeBatchWithValidationData(
    0,
    0,
    getAaveFallbackCallBatch({
      aave,
      collateralToken,
      collateralAmount: BigInt(1e18),
      debtToken,
      debtAmount: BigInt(1e18),
      salt: "0x",
      account: operation.sender,
      sp,
    }),
  );

  const aaProvider = createAAProvider(alchemyUrl, entryPoint);
  console.log("estimating gas", operation);
  await aaProvider.applyGasEstimates(operation);

  //sign
  await signUserOperation(operation, owner, entryPoint, sepolia);

  console.log("operation", operation);
  console.log(await aaProvider.sendUserOperation(operation));
})();

async function setup() {
  //setup provider
  const client = createWalletClient({
    account: owner,
    transport: http(alchemyUrl),
    chain,
  }).extend(publicActions);

  //mint collateral tokens to owner
  let { request: req0 } = await client.simulateContract({
    address: collateralToken,
    abi: [
      {
        inputs: [
          {
            name: "to",
            type: "address",
          },
          {
            name: "value",
            type: "uint256",
          },
        ],
        outputs: [],
        name: "mint",
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "mint",
    args: [owner.address, BigInt(100e18)],
  });
  await client.writeContract(req0);

  //approve collateral tokens to sp
  let { request: req1 } = await client.simulateContract({
    address: collateralToken,
    abi: Erc20ABI,
    functionName: "approve",
    args: [sp, BigInt(10e18)],
  });
  await client.writeContract(req1);

  //deposit at entrypoint
  const { request: req2 } = await client.simulateContract({
    address: entryPoint,
    abi: EntryPointABI,
    functionName: "depositTo",
    value: parseEther("0.05"),
    args: [
      await getCounterfactualAddress(
        createPublicClient({
          transport: http(alchemyUrl),
          chain,
        }),
        owner.address,
        factory,
      ),
    ],
  });
  await client.writeContract(req2);
}

