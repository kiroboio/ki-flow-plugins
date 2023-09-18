import { Variable } from "./coreLib";
import { EnhancedJsonFragmentType, FunctionParameterInput, HandleUndefined } from "./plugin";

export type SmartFunctionParameterInput<
  T extends string,
  C extends readonly EnhancedJsonFragmentType[],
  V extends boolean = false
> = V extends true ? FunctionParameterInput<T, C> : Exclude<FunctionParameterInput<T, C>, Variable>;

export type SmartPluginInput<A extends readonly EnhancedJsonFragmentType[]> = {
  [K in A[number]["name"]]: SmartFunctionParameterInput<
    Extract<A[number], { name: K }>["type"],
    HandleUndefined<Extract<A[number], { name: K }>["components"]>,
    HandleUndefined<Extract<A[number], { name: K }>["canBeVariable"], true>
  >;
};

// Create a type that takes PluginFunctionInput type and goes all the object values. If the object value is object or array then recursively go through the object and array and replace the value with the value of the object or array. If the object value is not object or array then replace the value with the value of the object or array.
