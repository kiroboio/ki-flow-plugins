import { ethers } from "ethers";

import {
  type JsonFragment,
  type JsonFragmentType,
  CallType,
  ChainId,
  EnhancedJsonFragment,
  HandleUndefined,
  IPluginCall,
  PluginFunctionInput,
  SupportedContract,
  Variable,
} from "../types";
import { FunctionParameter } from "./parameter";

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
  public readonly supportedContracts: readonly SupportedContract[] = [];

  public contractAddress?: string;
  public ethValue: string = "0";

  constructor(args: {
    abiFragment: A;
    chainId: ChainId;
    contractAddress?: string;
    supportedContracts?: readonly SupportedContract[];
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
    if (args.supportedContracts) {
      this.supportedContracts = args.supportedContracts.filter((s) => s.chainId === args.chainId);
      // If there is only one supported contract, set the contract address
      if (this.supportedContracts.length === 1) {
        this.contractAddress = this.supportedContracts[0].address;
      }
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
    // If there are supported contracts, check if the address is supported
    if (this.supportedContracts) {
      const supportedContract = this.supportedContracts.find((s) => s.address.toLowerCase() === address.toLowerCase());
      if (!supportedContract) {
        throw new Error(`Contract address ${address} is not supported`);
      }
    }
    this.contractAddress = address;
    return address;
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

  public async simulate({
    rpcUrl,
    from,
    input,
  }: {
    rpcUrl: string;
    from: string;
    input?: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  }) {
    if (!this.contractAddress) {
      throw new Error("Contract address not set");
    }

    const params = this.params.map((p) => {
      if (input && p.name in input) {
        return input[p.name as keyof typeof input];
      }
      return p.get();
    });
    const signer = new ethers.providers.JsonRpcProvider(rpcUrl).getSigner(from);
    const contract = new ethers.Contract(this.contractAddress, [this.abiFragment], signer);
    const result = await contract.callStatic[this.method](...params);
    return {
      success: true,
      result,
    };
  }

  public async safeSimulate({
    rpcUrl,
    from,
    input,
  }: {
    rpcUrl: string;
    from: string;
    input?: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  }) {
    if (!this.contractAddress) {
      return {
        success: false,
        result: "Contract address not set",
      };
    }
    try {
      return await this.simulate({ rpcUrl, from, input });
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

  public clone(): PluginFunction<A> {
    return new PluginFunction({
      abiFragment: this.abiFragment,
      chainId: this.chainId,
      contractAddress: this.contractAddress,
      input: this.get(),
    });
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
  supportedContracts,
}: {
  abiFragment: F;
  supportedContracts?: readonly SupportedContract[];
}) {
  return class Plugin extends PluginFunction<F> {
    constructor(args: {
      chainId: ChainId;
      contractAddress?: string;
      input?: Partial<PluginFunctionInput<HandleUndefined<F["inputs"]>>>;
    }) {
      super({
        abiFragment,
        chainId: args.chainId,
        contractAddress: args.contractAddress,
        supportedContracts,
        input: args.input,
      });
    }
  };
}

export function createProtocolPlugins<F extends JsonFragment>({
  abi,
  supportedContracts,
}: {
  abi: readonly F[];
  supportedContracts?: SupportedContract[];
}) {
  return abi
    .filter((f) => f.type === "function")
    .map((f) =>
      createPluginClass({
        abiFragment: f,
        supportedContracts,
      })
    );
}

type Plugin<F extends JsonFragment> = ReturnType<typeof createPluginClass<F>>;

export function createProtocolPluginsAsObject<F extends readonly JsonFragment[]>({
  abi,
  supportedContracts,
}: {
  abi: F;
  supportedContracts?: readonly SupportedContract[];
}): {
  [K in Extract<F[number], { type: "function" }>["name"]]: Plugin<Extract<F[number], { name: K; type: "function" }>>;
} {
  const data = abi
    .filter((f) => f.type === "function")
    .reduce(
      (acc, cur) => {
        return {
          ...acc,
          [cur.name]: createPluginClass({ abiFragment: cur, supportedContracts }),
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
