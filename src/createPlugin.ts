import { ethers } from "ethers";
import {
  type JsonFragmentType,
  type JsonFragment,
  FunctionParameterInput,
  FunctionParameterValue,
  HandleUndefined,
} from "./types/createPlugin";
import { ChainId, Param } from "./types";
import { IPluginCall } from "./types/coreLib";

export class FunctionParameter<
  N extends string = string,
  I extends string = string,
  C extends readonly JsonFragmentType[] = readonly JsonFragmentType[]
> {
  public readonly name: N;
  public readonly internalType: I;
  public readonly components: FunctionParameter[];

  public value?: FunctionParameterValue<N, I, C>;

  constructor(args: { name: N; type: I; components?: C }) {
    this.name = args.name;
    this.internalType = args.type;
    this.components = args.components?.map((c) => new FunctionParameter(c)) || [];
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

  public set(value: FunctionParameterInput<I, C>) {
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
              val[k[0] as keyof typeof val] = clone;
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
          storedVal[k[0] as keyof typeof storedVal] = clone;
        }
      });

      this.value = storedVal as any;
      return this.get();
    }
    this.value = value as unknown as FunctionParameterValue<N, I, C>;
    return this.get();
  }

  public get(): FunctionParameterInput<I, C> | undefined {
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
        return outputVal as unknown as FunctionParameterInput<I, C>;
      }
      const outputVal: FunctionParameterInput<"tuple", C> = {};
      const inputVal = this.value as FunctionParameterValue<N, "tuple", C>;
      Object.entries<any>(inputVal).forEach((k) => {
        outputVal[k[0] as keyof typeof outputVal] = k[1].get();
      });
      return outputVal as FunctionParameterInput<I, C>;
    }
    return this.value as unknown as FunctionParameterInput<I, C>;
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
}

type PluginFunctionInput<A extends readonly JsonFragmentType[]> = {
  [K in A[number]["name"]]: FunctionParameterInput<
    Extract<A[number], { name: K }>["type"],
    HandleUndefined<Extract<A[number], { name: K }>["components"]>
  >;
};

export class PluginFunction<A extends JsonFragment = JsonFragment> {
  public readonly chainId: ChainId;
  public readonly method: A["name"];
  public readonly params: FunctionParameter[] = [];

  public contractAddress?: string;

  constructor(args: { abiFragment: A; chainId: ChainId; contractAddress?: string }) {
    this.chainId = args.chainId;
    this.method = args.abiFragment.name;
    this.params = args.abiFragment.inputs?.map((c) => new FunctionParameter(c)) || [];
  }

  get functionSignature(): string {
    return `${this.method}(${this.params.map((p) => p.type).join(",")})`;
  }

  get functionSignatureHash(): string {
    return ethers.utils.id(this.functionSignature);
  }

  get inputs() {
    return this.params.reduce((acc, cur) => {
      return { ...acc, [cur.name]: cur.get() };
    }, {} as PluginFunctionInput<HandleUndefined<A["inputs"]>>);
  }

  public setContractAddress(address: string) {
    this.contractAddress = address;
  }

  public set(params: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>) {
    Object.entries<any>(params).forEach((p) => {
      const param = this.params.find((fp) => fp.name === p[0]);
      if (param) {
        param.set(p[1]);
      }
    });
  }

  public get() {
    return this.params.reduce<PluginFunctionInput<HandleUndefined<A["inputs"]>>>((acc, cur) => {
      return { ...acc, [cur.name]: cur.get() };
    }, {} as PluginFunctionInput<HandleUndefined<A["inputs"]>>);
  }

  public async create(): Promise<IPluginCall | undefined> {
    if (!this.contractAddress) return undefined;
    const params = this.params.map((p) => p.getAsCoreParam());
    const call: IPluginCall = {
      method: this.method,
      params,
      to: this.contractAddress,
    };
    return call;
  }
}

export function createPluginClass<F extends Readonly<JsonFragment>>({ abiFragment }: { abiFragment: F }) {
  return class Plugin extends PluginFunction<F> {
    constructor(args: { chainId: ChainId; contractAddress?: string }) {
      super({ abiFragment, chainId: args.chainId, contractAddress: args.contractAddress });
    }
  };
}

export function createProtocolPlugins<F extends JsonFragment>({ abi }: { abi: readonly F[] }) {
  return abi
    .filter((f) => f.type === "function")
    .map((f) =>
      createPluginClass({
        abiFragment: f,
      })
    );
}

type Plugin<F extends JsonFragment> = ReturnType<typeof createPluginClass<F>>;

export function createProtocolPluginsAsObject<F extends readonly JsonFragment[]>({
  abi,
}: {
  abi: F;
}): {
  [K in Extract<F[number], { type: "function" }>["name"]]: Plugin<Extract<F[number], { name: K; type: "function" }>>;
} {
  return abi
    .filter((f) => f.type === "function")
    .reduce(
      (acc, cur) => {
        return {
          ...acc,
          [cur.name]: createPluginClass({ abiFragment: cur }),
        };
      },
      {} as {
        [K in Extract<F[number], { type: "function" }>["name"]]: Plugin<
          Extract<F[number], { name: K; type: "function" }>
        >;
      }
    );
}
