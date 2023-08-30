import { FunctionParameter } from "../createPlugin";

export interface JsonFragmentType {
  /**
   *  The parameter name.
   */
  readonly name: string;
  /**
   *  If the parameter is indexed.
   */
  readonly indexed?: boolean;
  /**
   *  The type of the parameter.
   */
  readonly type: string;
  /**
   *  The internal Solidity type.
   */
  readonly internalType?: string;
  /**
   *  The components for a tuple.
   */
  readonly components?: ReadonlyArray<JsonFragmentType>;
}

export interface JsonFragment {
  /**
   *  The name of the error, event, function, etc.
   */
  readonly name: string;
  /**
   *  The type of the fragment (e.g. ``event``, ``"function"``, etc.)
   */
  readonly type?: string;
  /**
   *  If the event is anonymous.
   */
  readonly anonymous?: boolean;
  /**
   *  If the function is payable.
   */
  readonly payable?: boolean;
  /**
   *  If the function is constant.
   */
  readonly constant?: boolean;
  /**
   *  The mutability state of the function.
   */
  readonly stateMutability?: string;
  /**
   *  The input parameters.
   */
  readonly inputs?: ReadonlyArray<JsonFragmentType>;
  /**
   *  The output parameters.
   */
  readonly outputs?: ReadonlyArray<JsonFragmentType>;
  /**
   *  The gas limit to use when sending a transaction for this function.
   */
  readonly gas?: string;
}

export type HandleUndefined<T> = T extends undefined ? [] : T;

export type FunctionParameterInput<T extends string, C extends readonly JsonFragmentType[]> = T extends "tuple"
  ? {
      [K in C[number]["name"]]?: FunctionParameterInput<
        Extract<C[number], { name: K }>["type"],
        HandleUndefined<Extract<C[number], { name: K }>["components"]>
      >;
    }
  : T extends "bool"
  ? boolean | undefined
  : T extends `${infer _}[${string}`
  ? Array<FunctionParameterInput<_, C>>
  : string | undefined;

export type FunctionParameterValue<
  N extends string,
  T extends string,
  C extends readonly JsonFragmentType[]
> = T extends "tuple"
  ? {
      [K in C[number]["name"]]: FunctionParameter<
        K,
        Extract<C[number], { name: K }>["type"],
        HandleUndefined<Extract<C[number], { name: K }>["components"]>
      >;
    }
  : T extends "bool"
  ? FunctionParameter<T, "bool", C>
  : T extends `${infer _}[${string}`
  ? Array<FunctionParameterValue<N, _, C>>
  : FunctionParameter<N, T, C>;

export type PluginFunctionInput<A extends readonly JsonFragmentType[]> = {
  [K in A[number]["name"]]: FunctionParameterInput<
    Extract<A[number], { name: K }>["type"],
    HandleUndefined<Extract<A[number], { name: K }>["components"]>
  >;
};
