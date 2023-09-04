import { ethers } from "ethers";

import { ChainId, Param, SupportedContract } from "./types";
import { CallType, IPluginCall, Variable } from "./types/coreLib";
import {
  type JsonFragment,
  type JsonFragmentType,
  EnhancedJsonFragment,
  FunctionParameterInput,
  FunctionParameterValue,
  HandleUndefined,
  PluginFunctionInput,
} from "./types/createPlugin";

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

type ETHValueInput<T extends string | undefined> = T extends "payable" ? string : undefined | null;
type Outputs<
  T extends readonly JsonFragmentType[] | undefined,
  N extends string
> = T extends readonly JsonFragmentType[]
  ? {
      [key: number]: Variable & { type: "output"; id: { nodeId: N } };
    }
  : never;

export class PluginFunction<A extends EnhancedJsonFragment = EnhancedJsonFragment> {
  public readonly chainId: ChainId;
  public readonly method: A["name"];
  public readonly params: FunctionParameter[] = [];
  public readonly functionType: A["stateMutability"] = "payable";
  public readonly gas: A["gas"];
  public readonly abiFragment: A;
  public readonly outputParams: FunctionParameter[] = [];
  public readonly options: A["options"] = {};

  public contractAddress?: string;
  public ethValue: string = "0";

  constructor(args: {
    abiFragment: A;
    chainId: ChainId;
    contractAddress?: string;
    input?: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  }) {
    this.chainId = args.chainId;
    this.method = args.abiFragment.name;
    this.params = args.abiFragment.inputs?.map((c) => new FunctionParameter(c)) || [];
    this.outputParams = args.abiFragment.outputs?.map((c) => new FunctionParameter(c)) || [];
    this.functionType = args.abiFragment.stateMutability || "payable";
    this.gas = args.abiFragment.gas || "0";
    this.abiFragment = args.abiFragment;
    if (args.abiFragment.options) {
      this.options = args.abiFragment.options;
    }
    if (args.input) {
      this.set(args.input);
    }
    if (args.contractAddress) {
      this.contractAddress = args.contractAddress;
    }
  }

  get functionSignature(): string {
    return `${this.method}(${this.params.map((p) => p.type).join(",")})`;
  }

  get functionSignatureHash(): string {
    return ethers.utils.id(this.functionSignature);
  }

  get inputs() {
    const params = this.params.reduce((acc, cur) => {
      return { ...acc, [cur.name]: cur.get() };
    }, {} as PluginFunctionInput<HandleUndefined<A["inputs"]>>);
    return { params, set: this.set.bind(this), get: this.get.bind(this) };
  }

  public getOutputs<N extends string>(nodeId: N): Outputs<A["outputs"], N> {
    const params = this.outputParams.reduce((acc, _, i) => {
      return { ...acc, [i]: { type: "output", id: { nodeId, innerIndex: i } } };
    }, {});
    return params as Outputs<A["outputs"], N>;
  }

  public setValue(value: ETHValueInput<A["stateMutability"]>) {
    if (this.functionType !== "payable") return;
    this.ethValue = value || "0";
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
    return this.params.reduce((acc, cur) => {
      return { ...acc, [cur.name]: cur.get() };
    }, {} as PluginFunctionInput<HandleUndefined<A["inputs"]>>);
  }

  public async create(): Promise<IPluginCall | undefined> {
    if (!this.contractAddress) return undefined;
    const params = this.params.map((p) => p.getAsCoreParam());
    const call: IPluginCall = {
      method: this.method,
      params,
      value: this.ethValue,
      to: this.contractAddress,
      options: {
        callType: this.getCallType(),
        ...this.options,
      },
    };
    return call;
  }

  public async simulate({ rpcUrl, from }: { rpcUrl: string; from: string }) {
    if (!this.contractAddress) {
      return {
        success: false,
        result: "Contract address not set",
      };
    }

    const signer = new ethers.providers.JsonRpcProvider(rpcUrl).getSigner(from);
    const contract = new ethers.Contract(this.contractAddress, [this.abiFragment], signer);
    try {
      const result = await contract.callStatic[this.method](...this.params.map((p) => p.get()));
      return {
        success: true,
        result,
      };
    } catch (e) {
      if (typeof e === "object" && e && "reason" in e) {
        return {
          success: false,
          result: e.reason,
        };
      }
      return {
        success: false,
        result: e,
      };
    }
  }

  public getCallType(): CallType {
    if (this.functionType === "payable" || this.functionType === "nonpayable") {
      return "ACTION";
    }
    return "VIEW_ONLY";
  }
}

export function createPluginClass<F extends Readonly<JsonFragment>>({
  abiFragment,
  supportedAddressses,
}: {
  abiFragment: F;
  supportedAddressses?: readonly SupportedContract[];
}) {
  return class Plugin extends PluginFunction<F> {
    constructor(args: {
      chainId: ChainId;
      contractAddress?: string;
      input?: Partial<PluginFunctionInput<HandleUndefined<F["inputs"]>>>;
    }) {
      let contractAddress = "";
      if (args.contractAddress) {
        contractAddress = args.contractAddress;
      } else if (supportedAddressses) {
        // Find the supported address for the chainId
        const supportedAddress = supportedAddressses.find((s) => s.chainId === args.chainId);
        if (supportedAddress) {
          contractAddress = supportedAddress.address;
        }
      }

      super({ abiFragment, chainId: args.chainId, contractAddress, input: args.input });
    }
  };
}

export function createProtocolPlugins<F extends JsonFragment>({
  abi,
  supportedAddressses,
}: {
  abi: readonly F[];
  supportedAddressses?: SupportedContract[];
}) {
  return abi
    .filter((f) => f.type === "function")
    .map((f) =>
      createPluginClass({
        abiFragment: f,
        supportedAddressses,
      })
    );
}

type Plugin<F extends JsonFragment> = ReturnType<typeof createPluginClass<F>>;

export function createProtocolPluginsAsObject<F extends readonly JsonFragment[]>({
  abi,
  supportedAddressses,
}: {
  abi: F;
  supportedAddressses?: readonly SupportedContract[];
}): {
  [K in Extract<F[number], { type: "function" }>["name"]]: Plugin<Extract<F[number], { name: K; type: "function" }>>;
} {
  const data = abi
    .filter((f) => f.type === "function")
    .reduce(
      (acc, cur) => {
        return {
          ...acc,
          [cur.name]: createPluginClass({ abiFragment: cur, supportedAddressses }),
        };
      },
      {} as {
        [K in Extract<F[number], { type: "function" }>["name"]]: Plugin<
          Extract<F[number], { name: K; type: "function" }>
        >;
      }
    );
  return data;
}
