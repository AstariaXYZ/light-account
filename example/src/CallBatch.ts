import { Address, Hex } from "viem";

export type Call = {
  dest: Address;
  value: bigint;
  func: Hex;
};

export class CallBatch {
  dest: Address[] = [];
  value: bigint[] = [];
  func: Hex[] = [];

  push(call: Call) {
    this.dest.push(call.dest);
    this.value.push(call.value);
    this.func.push(call.func);
  }
}
