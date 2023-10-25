import { ethers, VoidSigner } from "ethers";
import _ from "lodash";

import { CALL_OVERHEAD } from "../constants";
import {
  type JsonFragment,
  CallType,
  ChainId,
  EnhancedJsonFragment,
  HandleUndefined,
  IPluginCall,
  PluginFunctionInput,
  SupportedContract,
  Variable,
} from "../types";
import { getOutputs } from "./outputs";
import { FunctionParameter } from "./parameter";

type ETHValueInput<T extends string | undefined> = T extends "payable" ? string : undefined | null;

export class PluginFunction<A extends EnhancedJsonFragment = EnhancedJsonFragment, I extends string = string> {
  public readonly chainId: ChainId;
  public readonly method: A["name"];
  public readonly params: FunctionParameter[] = [];
  public readonly functionType: A["stateMutability"] = "payable";
  public readonly gas: string = "0";
  public readonly abiFragment: A;
  public readonly outputParams: FunctionParameter[] = [];
  public readonly supportedContracts: readonly SupportedContract[] = [];
  public readonly protocol: I;

  public contractAddress?: string;
  public ethValue: string | Variable = "0";
  public options: A["options"] = {};
  public vaultAddress: string | undefined;
  public provider: ethers.providers.Provider;

  constructor(args: {
    protocol: I;
    abiFragment: A;
    chainId: ChainId;
    rpcUrl?: string;
    provider?: ethers.providers.Provider;
    vaultAddress?: string;
    contractAddress?: string;
    supportedContracts?: readonly SupportedContract[];
    input?: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  }) {
    this.protocol = args.protocol;
    this.chainId = args.chainId;
    this.method = args.abiFragment.name;
    this.params = args.abiFragment.inputs?.map((c) => new FunctionParameter(c)) || [];
    this.outputParams = args.abiFragment.outputs?.map((c) => new FunctionParameter(c)) || [];
    this.functionType = args.abiFragment.stateMutability || "payable";
    this.abiFragment = args.abiFragment;

    if (args.vaultAddress) this.vaultAddress = args.vaultAddress;
    if (args.abiFragment.gas) this.gas = args.abiFragment.gas;
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
    if (args.provider) {
      this.provider = args.provider;
    } else if (args.rpcUrl) {
      this.provider = new ethers.providers.JsonRpcProvider(args.rpcUrl);
    } else {
      throw new Error("Provider or RPC URL not provided");
    }
  }

  get functionSignature(): string {
    return `${this.method}(${this.params.map((p) => p.type).join(",")})`;
  }

  get functionSignatureHash(): string {
    return ethers.utils.id(this.functionSignature);
  }

  get inputs() {
    // const params = this.params.reduce((acc, cur) => {
    //   return { ...acc, [cur.name]: cur.get() };
    // }, {} as PluginFunctionInput<HandleUndefined<A["inputs"]>>);
    return { set: this.set.bind(this), get: this.get.bind(this) };
  }

  get inputTypes() {
    return this.abiFragment.inputs || [];
  }

  get outputs() {
    return getOutputs<A["outputs"]>({ outputs: this.abiFragment.outputs });
  }

  public async getGasLimit() {
    if (!this.gas) return (80000n + CALL_OVERHEAD).toString(); // default gas limit
    return (BigInt(this.gas) + CALL_OVERHEAD).toString();
  }

  public setValue(value: ETHValueInput<A["stateMutability"]> | Variable) {
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

  public setOptions(options: A["options"]) {
    this.options = _.merge({}, this.options, options);
    return this.options;
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
      from: this.vaultAddress,
      options: {
        callType: this.getCallType(),
        gasLimit: await this.getGasLimit(),
        ...this.options,
      },
    };
    return call;
  }

  public async simulate({
    from,
    input,
  }: {
    from: string;
    input?: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  }) {
    if (!this.contractAddress) {
      throw new Error("Contract address not set");
    }
    const provider = this.provider;

    const params = this.params.map((p) => {
      if (input && p.name in input) {
        return input[p.name as keyof typeof input];
      }
      return p.get();
    });
    const signer = new VoidSigner(from, provider);
    const contract = new ethers.Contract(this.contractAddress, [this.abiFragment], signer);
    const result = await contract.callStatic[this.method](...params);
    return {
      success: true,
      result,
    };
  }

  public async safeSimulate({
    from,
    input,
  }: {
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
      return await this.simulate({ from, input });
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
      protocol: this.protocol,
      abiFragment: this.abiFragment,
      chainId: this.chainId,
      contractAddress: this.contractAddress,
      input: this.get(),
      vaultAddress: this.vaultAddress,
    });
  }

  public isPlugin(data: IPluginCall) {
    const isMethod = data.method === this.method;
    const isParams = data.params.every((p, i) => {
      return p.name === this.params[i].name && p.type === this.params[i].type;
    });

    return isMethod && isParams;
  }

  public getCallType(): CallType {
    if (this.functionType === "payable" || this.functionType === "nonpayable") {
      return "ACTION";
    }
    return "VIEW_ONLY";
  }
}

export function createPlugin<F extends Readonly<JsonFragment>, I extends string>({
  abiFragment,
  protocol,
  supportedContracts,
}: {
  abiFragment: F;
  protocol: I;
  supportedContracts?: readonly SupportedContract[];
}) {
  return class Plugin extends PluginFunction<F, I> {
    public static readonly id = `${protocol}_${abiFragment.name}`;
    public readonly id = Plugin.id;
    constructor(args: {
      chainId: ChainId;
      rpcUrl?: string;
      provider?: ethers.providers.Provider;
      vaultAddress?: string;
      contractAddress?: string;
      input?: Partial<PluginFunctionInput<HandleUndefined<F["inputs"]>>>;
    }) {
      super({
        protocol,
        abiFragment,
        chainId: args.chainId,
        contractAddress: args.contractAddress,
        supportedContracts,
        input: args.input,
        vaultAddress: args.vaultAddress,
        rpcUrl: args.rpcUrl,
        provider: args.provider,
      });
    }
  };
}

export function createProtocolPlugins<F extends JsonFragment, I extends string>({
  abi,
  supportedContracts,
  protocol,
}: {
  protocol: I;
  abi: readonly F[];
  supportedContracts?: SupportedContract[];
}) {
  return abi
    .filter((f) => f.type === "function")
    .map((f) =>
      createPlugin({
        protocol,
        abiFragment: f,
        supportedContracts,
      })
    );
}

export type Plugin<F extends JsonFragment, I extends string> = ReturnType<typeof createPlugin<F, I>>;

export function createProtocolPluginsAsObject<F extends readonly JsonFragment[], I extends string>({
  abi,
  supportedContracts,
  protocol,
}: {
  protocol: I;
  abi: F;
  supportedContracts?: readonly SupportedContract[];
}): {
  [K in Extract<F[number], { type: "function" }>["name"]]: Plugin<Extract<F[number], { name: K; type: "function" }>, I>;
} {
  const data = abi
    .filter((f) => f.type === "function")
    .reduce(
      (acc, cur) => {
        return {
          ...acc,
          [cur.name]: createPlugin({ abiFragment: cur, supportedContracts, protocol }),
        };
      },
      {} as {
        [K in Extract<F[number], { type: "function" }>["name"]]: Plugin<
          Extract<F[number], { name: K; type: "function" }>,
          I
        >;
      }
    );
  return data;
}
