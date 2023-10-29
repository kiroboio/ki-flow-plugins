import { ArrayInputFragment, InputFragment, TupleInputFragment } from "../Plugin";
import { Variable } from "./coreLib";
import { EnhancedJsonFragmentType, HandleUndefined } from "./plugin";

export type BaseInputData<P extends readonly EnhancedJsonFragmentType[]> = Array<GetInputFragmentType<P[number]>>;
export type InputFragmentType = InputFragment<any> | TupleInputFragment<any> | ArrayInputFragment<any>;

export type GetInputFragmentType<F extends EnhancedJsonFragmentType> = F["type"] extends "tuple"
  ? F["components"] extends readonly EnhancedJsonFragmentType[]
    ? TupleInputFragment<F> & {
        [K in F["components"][number]["name"]]: GetInputFragmentType<Extract<F["components"][number], { name: K }>>;
      }
    : never
  : F["type"] extends `${string}]`
  ? ArrayInputFragment<F> & {
      [P in number]: GetInputFragmentType<{ type: GetArrayType<F>; name: string }>;
    }
  : InputFragment<F>;

export type GetArrayType<F extends EnhancedJsonFragmentType> = F["type"] extends `${infer U}[${string}` ? U : string;

export type InputMethods<P extends readonly EnhancedJsonFragmentType[]> = {
  [K in BaseInputData<P>[number]["name"]]: GetInputFragmentType<Extract<P[number], { name: K }>>;
};

export type CanBeVariable<T extends EnhancedJsonFragmentType> = T["canBeVariable"] extends false
  ? never
  : T["type"] extends "tuple"
  ? never
  : Variable;

export type InputFragmentValue<F extends EnhancedJsonFragmentType> =
  | (F["type"] extends "bool"
      ? boolean
      : F["type"] extends "tuple"
      ? InputSet<HandleUndefined<F["components"]>>
      : F["type"] extends `${infer _}[${string}`
      ? InputFragmentValue<{ type: _; name: string }>[]
      : string)
  | CanBeVariable<F>;

export type InputSet<P extends readonly EnhancedJsonFragmentType[]> = {
  [K in P[number]["name"]]: Extract<P[number], { name: K }>["type"] extends "tuple"
    ? InputSet<HandleUndefined<Extract<P[number], { name: K }>["components"]>>
    : Extract<P[number], { name: K }>["type"] extends `${infer _}[${string}`
    ? InputFragmentValue<{ type: _; name: string }>[]
    : InputFragmentValue<Extract<P[number], { name: K }>>;
};
