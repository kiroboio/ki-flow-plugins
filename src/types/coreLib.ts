export type GlobalVariable =
  | "blockNumber"
  | "blockTimestamp"
  | "gasPrice"
  | "minerAddress"
  | "originAddress"
  | "investorAddress"
  | "activatorAddress"
  | "engineAddress"
  | "chainId";

export type Variable =
  | { type: "output"; id: { nodeId: string; innerIndex: number } }
  | { type: "external"; id: number }
  | { type: "global"; id: GlobalVariable }
  | { type: "computed"; id: string };
//   | { type: "validation"; id: string };

export type ParamValue = boolean | string | string[] | boolean[] | Param[] | Param[][] | Variable | ParamValue[];

export interface Param {
  name: string;
  type: string;
  value?: ParamValue;
  customType?: boolean;
  hashed?: boolean;
}

export enum Flow {
  OK_CONT_FAIL_REVERT = "OK_CONT_FAIL_REVERT",
  OK_CONT_FAIL_STOP = "OK_CONT_FAIL_STOP",
  OK_CONT_FAIL_CONT = "OK_CONT_FAIL_CONT",
  OK_REVERT_FAIL_CONT = "OK_REVERT_FAIL_CONT",
  OK_REVERT_FAIL_STOP = "OK_REVERT_FAIL_STOP",
  OK_STOP_FAIL_CONT = "OK_STOP_FAIL_CONT",
  OK_STOP_FAIL_REVERT = "OK_STOP_FAIL_REVERT",
  OK_STOP_FAIL_STOP = "OK_STOP_FAIL_STOP",
}

export const CALL_TYPE = {
  ACTION: "0",
  VIEW_ONLY: "1",
  LIBRARY: "2",
  LIBRARY_VIEW_ONLY: "3",
} as const;

export type CallType = keyof typeof CALL_TYPE;

export interface CallOptions {
  permissions?: string;
  gasLimit?: string;
  flow?: Flow;
  jumpOnSuccess?: string;
  jumpOnFail?: string;
  falseMeansFail?: boolean;
  callType?: CallType;
  validation?: string;
  payerIndex?: number;
}

export interface IPluginCall {
  value?: string | Variable;
  to: string | Variable;
  from: string | Variable;
  method: string;
  params: Param[];
  options?: CallOptions;
}
