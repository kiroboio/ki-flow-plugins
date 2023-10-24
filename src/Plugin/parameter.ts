import { InstanceOf } from "../helpers/instanceOf";
import {
  EnhancedJsonFragmentType,
  FPValue,
  FunctionParameterInput,
  FunctionParameterValue,
  HandleUndefined,
  Param,
} from "../types";

// export type GetWithMethods<T extends FunctionParameter, C extends ReadonlyArray<EnhancedJsonFragmentType>> = {
//   get(): FunctionParameterInput<T["internalType"], C, T["canBeVariable"]>;
//   set(value: FunctionParameterInput<T["internalType"], C, T["canBeVariable"]>): void;
// } & {};

// type InputToType<T extends EnhancedJsonFragmentType> = T["components"] extends ReadonlyArray<EnhancedJsonFragmentType>
//   ? InputsToObject<T>
//   : T["type"] extends "bool"
//   ? boolean
//   : string;

export type ParameterInputFromFragments<T extends ReadonlyArray<EnhancedJsonFragmentType> | undefined> =
  T extends readonly EnhancedJsonFragmentType[]
    ? {
        [K in T[number]["name"]]: InputsToObject<Extract<T[number], { name: K }>>;
      }
    : object;

type InputsToObject<T extends EnhancedJsonFragmentType> = {
  get(): FunctionParameterInput<
    T["type"],
    HandleUndefined<T["components"]>,
    HandleUndefined<T["canBeVariable"], boolean>
  >;
  set(
    value: FunctionParameterInput<
      T["type"],
      HandleUndefined<T["components"]>,
      HandleUndefined<T["canBeVariable"], boolean>
    >
  ): void;
} & ParameterInputFromFragments<T["components"]>;

type FPComponents<C extends EnhancedJsonFragmentType> = C["components"] extends ReadonlyArray<EnhancedJsonFragmentType>
  ? C["components"]
  : [];

type FPCanBeVariable<V extends EnhancedJsonFragmentType> = V["canBeVariable"] extends boolean
  ? V["canBeVariable"]
  : true;
type FPHashed<H extends EnhancedJsonFragmentType> = H["hashed"] extends boolean ? H["hashed"] : false;
type FPOptions<O extends EnhancedJsonFragmentType> = O["options"] extends readonly string[] ? O["options"] : undefined;

export class FunctionParameter<F extends EnhancedJsonFragmentType = EnhancedJsonFragmentType> {
  public readonly name: F["name"];
  public readonly internalType: F["type"];
  public readonly components: FPComponents<F>;
  public readonly canBeVariable: FPCanBeVariable<F>;
  public readonly hashed: FPHashed<F>;
  public readonly options?: FPOptions<F>;

  private value?: FPValue<F["name"], F["type"], FPComponents<F>, FPOptions<F>>;
  private readonly _abiFragment: F;

  constructor(abiFragment: F) {
    this._abiFragment = abiFragment;
    this.name = abiFragment.name;
    this.internalType = abiFragment.type;
    this.components = (abiFragment.components || []) as FPComponents<F>;
    this.canBeVariable = (abiFragment.canBeVariable ?? true) as FPCanBeVariable<F>;
    this.hashed = (abiFragment.hashed ?? false) as FPHashed<F>;
    if (abiFragment.options) {
      // Options are not allowed on tuples and arrays
      if (this._isTuple() || this._isArray()) {
        throw new Error(`${this.name}: Options are not allowed on tuples or arrays`);
      }

      // If there are options, we need to validate them to make sure they are valid
      abiFragment.options?.forEach((o) => {
        this._validateValue(o);
      });
      this.options = abiFragment.options as FPOptions<F>;
    }
  }

  get type(): string {
    // If a type is tuple AND has components, it's a custom type
    if (this._isTuple()) {
      // If the internalType ends with [] or [number], it's an array
      let arrayString = "";
      if (this._isArray()) {
        // Get "[]" or "[number]" from the end of the string
        arrayString = this.internalType.slice(this.internalType.lastIndexOf("["));
      }

      return `(${this._generateTypeFromComponents(
        this.components as readonly EnhancedJsonFragmentType[]
      )})${arrayString}`;
    }
    return this.internalType;
  }

  public set(value: FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>>) {
    if (this._isTuple()) {
      if (this._isArray()) {
        const storedVal: FunctionParameterValue<F["name"], "tuple[]", FPComponents<F>> = [];
        const inputVal = value as unknown as FunctionParameterInput<"tuple[]", FPComponents<F>>;
        inputVal.forEach((v) => {
          const val: FunctionParameterValue<F["name"], "tuple", FPComponents<F>> = {} as any;
          Object.entries<any>(v).forEach((k) => {
            const clone = this._findComponentFromName(k[0])?.clone();
            if (clone) {
              clone.set(k[1]);
              val[k[0] as keyof typeof val] = clone as any;
            }
          });
          storedVal.push(val);
        });
        this.value = storedVal as any;
        return this.get();
      }
      const storedVal: FunctionParameterValue<F["name"], "tuple", FPComponents<F>> = {} as any;

      const val = value as unknown as FunctionParameterInput<"tuple", FPComponents<F>>;
      Object.entries<any>(val).forEach((k) => {
        const clone = this._findComponentFromName(k[0])?.clone();
        if (clone) {
          clone.set(k[1]);
          storedVal[k[0] as keyof typeof storedVal] = clone as any;
        }
      });

      this.value = storedVal as any;
      return this.get();
    }
    this._validateValue(value);
    this.value = value as unknown as FPValue<F["name"], F["type"], FPComponents<F>, FPOptions<F>>;
    return this.get();
  }

  public get(): FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>> | undefined {
    if (this._isTuple()) {
      if (this._isArray()) {
        const outputVal: FunctionParameterInput<"tuple[]", FPComponents<F>> = [];
        const inputVal = this.value as unknown as FunctionParameterValue<F["name"], "tuple[]", FPComponents<F>>;
        inputVal.forEach((v) => {
          const arrayVal: FunctionParameterInput<"tuple", FPComponents<F>> = {};
          Object.entries<any>(v).forEach((k) => {
            arrayVal[k[0] as keyof typeof arrayVal] = k[1].get();
          });
          outputVal.push(arrayVal);
        });
        return outputVal as unknown as FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>>;
      }
      const outputVal: FunctionParameterInput<"tuple", FPComponents<F>> = {};
      const inputVal = this.value as FunctionParameterValue<F["name"], "tuple", FPComponents<F>>;
      Object.entries<any>(inputVal).forEach((k) => {
        outputVal[k[0] as keyof typeof outputVal] = k[1].get();
      });
      return outputVal as FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>>;
    }
    return this.value as unknown as FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>>;
  }

  public getStrict(): FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>> {
    const val = this.get();
    if (val === undefined) {
      throw new Error(`${this.name}: Value not set`);
    }
    return val;
  }

  public getWithMethods(): {
    get(): FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>>;
    set(value: FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>>): void;
    // } & ParameterInputFromFragments<FPComponents<F>> {
  } {
    // const params = this.components.reduce((acc, cur) => {
    //   return { ...acc, [cur.name]: cur.getWithMethods() };
    // }, {} as ParameterInputFromFragments<FPComponents<F>>);
    const params = {};
    return {
      ...params,
      get: this.get.bind(this) as () => FunctionParameterInput<F["type"], FPComponents<F>, FPCanBeVariable<F>>,
      set: this.set.bind(this),
    };
  }

  public getAsCoreParam(): Param {
    const baseParam = {
      name: this.name,
      type: this.type,
      hashed: this.hashed,
    };
    if (this._isTuple()) {
      // Check if the tuple is an array
      if (this._isArray()) {
        const val = this.value as unknown as FunctionParameterValue<F["name"], "tuple[]", FPComponents<F>>;
        return {
          ...baseParam,
          customType: true,
          value: val.map((p) => {
            return Object.entries<any>(p).map((c) => c[1].getAsCoreParam());
          }),
        };
      }
      const val = this.value as FunctionParameterValue<F["name"], "tuple", FPComponents<F>>;
      return {
        ...baseParam,
        customType: true,
        value: Object.entries<any>(val).map((c) => c[1].getAsCoreParam()),
      };
    }
    return {
      ...baseParam,
      value: this.get(),
    };
  }

  public clone(): FunctionParameter<F> {
    return new FunctionParameter(this._abiFragment);
  }

  private _findComponentFromName(name: string): FunctionParameter | undefined {
    // @ts-ignore
    return this.components.find((c) => c.name === name);
  }

  private _isTuple(): boolean {
    return this.internalType.includes("tuple") && this.components.length > 0;
  }

  private _isArray(): boolean {
    return this.internalType.endsWith("]");
  }

  private _validateValue(value: any) {
    if (InstanceOf.Variable(value)) return;
    const type = this.internalType;
    if (type === "tuple" || type.includes("]")) {
      return;
    }
    if (type === "bool") {
      if (typeof value !== "boolean") {
        throw new Error(`${this.name}: Expected boolean, got ${typeof value}`);
      }
      return;
    }
    if (typeof value !== "string") {
      throw new Error(`${this.name}: Expected string, got ${typeof value}`);
    }
    // Check if there are options. If there are, check if the value is one of the options
    if (this.options) {
      if (!this.options.includes(value)) {
        throw new Error(`${this.name}: Invalid value. Expected: ${this.options.join(", ")}`);
      }
      return;
    }
    if (type.startsWith("uint")) {
      if (value.includes(".")) {
        throw new Error(`${this.name}: Cannot be a decimal`);
      }
      if (value.startsWith("-")) {
        throw new Error(`${this.name}: Cannot be negative`);
      }
      if (isNaN(+value)) {
        throw new Error(`${this.name}: Invalid number`);
      }
      const bits = type.match(/\d+/g);
      if (bits && BigInt(value) > 2n ** BigInt(bits[0]) - 1n) {
        throw new Error(`${this.name}: Value too large for ${type}`);
      }
    }

    if (type.startsWith("int")) {
      if (value.includes(".")) {
        throw new Error(`${this.name}: Cannot be a decimal`);
      }
      if (isNaN(+value)) {
        throw new Error(`${this.name}: Invalid number`);
      }
      const bits = type.match(/\d+/g);
      if (bits && BigInt(value) > 2n ** (BigInt(bits[0]) - 1n) - 1n) {
        throw new Error(`${this.name}: Value too large for ${type}`);
      }
      if (bits && BigInt(value) < -(2n ** (BigInt(bits[0]) - 1n))) {
        throw new Error(`${this.name}: Value too small for ${type}`);
      }
    }

    if (type === "address") {
      if (!value.startsWith("0x")) {
        throw new Error(`${this.name}: Must start with 0x`);
      }
      if (value.length !== 42) {
        throw new Error(`${this.name}: Invalid address`);
      }
    }

    if (type.startsWith("bytes")) {
      if (!value.startsWith("0x")) {
        throw new Error(`${this.name}: Must start with 0x`);
      }
      const length = type.match(/\d+/g);
      if (!length) {
        // If no length, then the type is `bytes`
        return;
      }
      const requiredLength = +length[0] * 2 + 2;
      if (value.length !== requiredLength) {
        throw new Error(`${this.name}: Invalid ${type} length`);
      }
    }
  }

  private _generateTypeFromComponents(components: readonly EnhancedJsonFragmentType[]): string {
    return `(${components
      .map((c) => {
        if (c.components) {
          return this._generateTypeFromComponents(c.components);
        }
        return c.type;
      })
      .join(",")})`;
  }
}
