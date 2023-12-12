import { type Address } from "viem";
import { UserOperation } from "./UserOperation.js";

export function createAAProvider(
  alchemyUrl: string,
  entryPoint: Address,
): AAProvider {
  return new AAProvider(alchemyUrl, entryPoint);
}

//TODO: parse responses w/ zod
export class AAProvider {
  alchemyUrl: string;
  entryPoint: Address;
  constructor(alchemyUrl: string, entryPoint: Address) {
    this.alchemyUrl = alchemyUrl;
    this.entryPoint = entryPoint;
  }

  async sendUserOperation(operation: UserOperation) {
    return await (
      await fetch(
        this.alchemyUrl,
        this.rpcPost("eth_sendUserOperation", [operation, this.entryPoint]),
      )
    ).json();
  }

  async getMaxPriorityFeePerGas(alchemyUrl: string): Promise<bigint> {
    return BigInt(
      (
        await (
          await fetch(alchemyUrl, this.rpcPost("rundler_maxPriorityFeePerGas"))
        ).json()
      ).result,
    );
  }

  async estimateUserOperationGas(operation: UserOperation) {
    (BigInt.prototype as any).toJSON = function () {
      return "0x" + this.toString(16);
    };

    return await (
      await fetch(
        this.alchemyUrl,
        this.rpcPost("eth_estimateUserOperationGas", [
          operation,
          this.entryPoint,
        ]),
      )
    ).json();
  }

  async applyGasEstimates(operation: UserOperation) {
    const response = await this.estimateUserOperationGas(operation);
    console.log(response);
    const { preVerificationGas, verificationGasLimit, callGasLimit } =
      response.result;

    operation.preVerificationGas = preVerificationGas;
    operation.verificationGasLimit = verificationGasLimit;
    operation.callGasLimit = callGasLimit;
    operation.maxPriorityFeePerGas = await this.getMaxPriorityFeePerGas(
      this.alchemyUrl,
    );
  }

  private rpcPost(method: string, params?: any | undefined): RequestInit {
    return {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method,
        params,
      }),
    };
  }
}
