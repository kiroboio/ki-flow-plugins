import { FunctionParameter } from "../Plugin";
import { Variable } from "./coreLib";

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

export interface EnhancedJsonFragmentType extends JsonFragmentType {
  readonly canBeVariable?: boolean;
  readonly components?: ReadonlyArray<EnhancedJsonFragmentType>;
  readonly hashed?: boolean;
  readonly options?: readonly string[];
}

export interface EnhancedJsonFragment extends JsonFragment {
  readonly inputs?: ReadonlyArray<EnhancedJsonFragmentType>;
  readonly outputs?: ReadonlyArray<EnhancedJsonFragmentType>;
  options?: {
    falseMeansFail?: boolean;
  };
}

export type HandleUndefined<T, V = []> = T extends undefined ? V : T;

// Can be variable if type is address, bytesX (not bytes), uintX, intX. Cannot be if the type is bytes, string
export type HandleValueType<T extends string, V extends boolean> = V extends false
  ? string
  : T extends "address" | `bytes${number}` | `uint${number}` | `int${number}`
  ? string | Variable
  : string;

export type HandleValue<V extends boolean, T> = V extends true ? Variable | T : T;

export type FunctionParameterInput<
  T extends string,
  C extends readonly EnhancedJsonFragmentType[],
  V extends boolean = true
> = T extends "tuple"
  ? {
      [K in C[number]["name"]]?: FunctionParameterInput<
        Extract<C[number], { name: K }>["type"],
        HandleUndefined<Extract<C[number], { name: K }>["components"]>,
        HandleUndefined<Extract<C[number], { name: K }>["canBeVariable"], true>
      >;
    }
  : T extends "bool"
  ? HandleValue<V, boolean> | undefined
  : T extends `${infer _}[${string}`
  ? Array<FunctionParameterInput<_, C>>
  : HandleValueType<T, V> | undefined;

export type FPInput<
  T extends string,
  C extends readonly EnhancedJsonFragmentType[],
  O extends readonly string[] | undefined,
  V extends boolean = true
> = O extends readonly string[] ? O[number] : FunctionParameterInput<T, C, V>;

export type FunctionParameterValue<
  N extends string,
  T extends string,
  C extends readonly EnhancedJsonFragmentType[]
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

export type FPValue<
  N extends string,
  T extends string,
  C extends readonly EnhancedJsonFragmentType[],
  O extends readonly string[] | undefined
> = O extends readonly string[] ? O[number] : FunctionParameterValue<N, T, C>;

export type PluginFunctionInput<A extends readonly EnhancedJsonFragmentType[]> = {
  [K in A[number]["name"]]: FPInput<
    Extract<A[number], { name: K }>["type"],
    HandleUndefined<Extract<A[number], { name: K }>["components"]>,
    Extract<A[number], { name: K }>["options"],
    HandleUndefined<Extract<A[number], { name: K }>["canBeVariable"], true>
  >;
};

export type ProtocolPlugins<T> = T extends { [key: string]: infer V } ? V[] : never;
