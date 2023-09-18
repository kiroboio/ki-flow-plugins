import { EnhancedJsonFragmentType, FunctionParameterInput, FunctionParameterValue, Param } from "../types";

export class FunctionParameter<
  N extends string = string,
  I extends string = string,
  C extends readonly EnhancedJsonFragmentType[] = readonly EnhancedJsonFragmentType[],
  V extends boolean = boolean
> {
  public readonly name: N;
  public readonly internalType: I;
  public readonly components: FunctionParameter[];
  public readonly canBeVariable: V;

  public value?: FunctionParameterValue<N, I, C>;

  constructor(args: { name: N; type: I; components?: C; canBeVariable?: V }) {
    this.name = args.name;
    this.internalType = args.type;
    this.components = args.components?.map((c) => new FunctionParameter(c)) || [];
    this.canBeVariable = args.canBeVariable || (true as V);
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

      return `(${this.components.map((c) => c.type).join(",")})${arrayString}`;
    }
    return this.internalType;
  }

  public set(value: FunctionParameterInput<I, C, V>) {
    if (this._isTuple()) {
      if (this._isArray()) {
        const storedVal: FunctionParameterValue<N, "tuple[]", C> = [];
        const inputVal = value as unknown as FunctionParameterInput<"tuple[]", C>;
        inputVal.forEach((v) => {
          const val: FunctionParameterValue<N, "tuple", C> = {} as any;
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
      const storedVal: FunctionParameterValue<N, "tuple", C> = {} as any;

      const val = value as unknown as FunctionParameterInput<"tuple", C>;
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
    this.value = value as unknown as FunctionParameterValue<N, I, C>;
    return this.get();
  }

  public get(): FunctionParameterInput<I, C, V> | undefined {
    if (this._isTuple()) {
      if (this._isArray()) {
        const outputVal: FunctionParameterInput<"tuple[]", C> = [];
        const inputVal = this.value as FunctionParameterValue<N, "tuple[]", C>;
        inputVal.forEach((v) => {
          const arrayVal: FunctionParameterInput<"tuple", C> = {};
          Object.entries<any>(v).forEach((k) => {
            arrayVal[k[0] as keyof typeof arrayVal] = k[1].get();
          });
          outputVal.push(arrayVal);
        });
        return outputVal as unknown as FunctionParameterInput<I, C, V>;
      }
      const outputVal: FunctionParameterInput<"tuple", C> = {};
      const inputVal = this.value as FunctionParameterValue<N, "tuple", C>;
      Object.entries<any>(inputVal).forEach((k) => {
        outputVal[k[0] as keyof typeof outputVal] = k[1].get();
      });
      return outputVal as FunctionParameterInput<I, C, V>;
    }
    return this.value as unknown as FunctionParameterInput<I, C, V>;
  }

  public getStrict(): FunctionParameterInput<I, C, V> {
    const val = this.get();
    if (!val) {
      throw new Error(`${this.name}: Value not set`);
    }
    return val;
  }

  public getAsCoreParam(): Param {
    const baseParam = {
      name: this.name,
      type: this.type,
    };
    if (this._isTuple()) {
      // Check if the tuple is an array
      if (this._isArray()) {
        const val = this.value as FunctionParameterValue<N, "tuple[]", C>;
        return {
          ...baseParam,
          customType: true,
          value: val.map((p) => {
            return Object.entries<any>(p).map((c) => c[1].getAsCoreParam());
          }),
        };
      }
      const val = this.value as FunctionParameterValue<N, "tuple", C>;
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

  public clone(): FunctionParameter {
    return new FunctionParameter({
      name: this.name,
      type: this.internalType,
      components: this.components.map((c) => c.clone()),
    });
  }

  private _findComponentFromName(name: string): FunctionParameter | undefined {
    return this.components.find((c) => c.name === name);
  }

  private _isTuple(): boolean {
    return this.internalType.includes("tuple") && this.components.length > 0;
  }

  private _isArray(): boolean {
    return this.internalType.endsWith("]");
  }

  private _validateValue(value: any) {
    const type = this.internalType;
    if (type === "tuple" || type.includes("]")) {
      return;
    }
    if (type === "bool") {
      if (typeof value !== "boolean") {
        throw new Error(`${this.name}: Expected boolean, got ${typeof value}`);
      }
    }
    if (typeof value !== "string") {
      throw new Error(`${this.name}: Expected string, got ${typeof value}`);
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
    }

    if (type.startsWith("int")) {
      if (value.includes(".")) {
        throw new Error(`${this.name}: Cannot be a decimal`);
      }
      if (isNaN(+value)) {
        throw new Error(`${this.name}: Invalid number`);
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
}
