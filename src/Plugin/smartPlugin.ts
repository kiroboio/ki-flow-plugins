import { ethers } from "ethers";
import NodeCache from "node-cache";

import {
  ChainId,
  EnhancedJsonFragment,
  EnhancedJsonFragmentType,
  HandleUndefined,
  IPluginCall,
  PluginFunctionInput,
  RequiredApproval,
  RequiredObject,
} from "../types";
import { Output } from "./outputs";
import { FunctionParameter } from "./parameter";
import { Plugin } from "./plugin";

// Optional:
// - optional helpers when constructing plugin (for example, cache for Uniswap). After talking with Sumbat - not mandatory.
// TODO: fromJSON, toJSON

// type CreateFunctionParameter<T extends EnhancedJsonFragmentType> = FunctionParameter<
//   T["name"],
//   T["type"],
//   T["components"] extends readonly EnhancedJsonFragmentType[] ? T["components"] : [],
//   T["canBeVariable"] extends boolean ? T["canBeVariable"] : true,
//   T["hashed"] extends boolean ? T["hashed"] : false,
//   T["options"] extends readonly string[] ? T["options"] : undefined
// >;

// Type that creates FunctionParameter array from EnhancedJsonFragment[]
type CreateFunctionParameters<T extends readonly EnhancedJsonFragmentType[]> = FunctionParameter<T[number]>[];

export type Params<T extends readonly EnhancedJsonFragmentType[] | undefined> = T extends undefined
  ? []
  : T extends readonly EnhancedJsonFragmentType[]
  ? CreateFunctionParameters<T>
  : never;

type RequiredActionsFunction<C extends ChainId, A extends EnhancedJsonFragment> = (args: {
  input: RequiredObject<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  vaultAddress: string;
  chainId: C;
}) => RequiredApproval[];

export function createSmartPlugin<
  P extends readonly Plugin<any, string>[] = readonly Plugin<any, string>[],
  A extends EnhancedJsonFragment = EnhancedJsonFragment,
  C extends ChainId = ChainId,
  RF extends RequiredActionsFunction<C, A> = RequiredActionsFunction<C, A>,
  PR extends string = string
>({
  protocol,
  // supportedPlugins,
  prepare,
  abiFragment,
  prepareOutputs,
  requiredActions,
  estimateGas,
}: {
  protocol: PR;
  abiFragment: A;
  supportedPlugins: P;
  prepare: (args: {
    input: RequiredObject<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
    vaultAddress: string;
    provider: ethers.providers.JsonRpcProvider;
    chainId: C;
  }) => Promise<InstanceType<P[number]>>;
  prepareOutputs?: (args: {
    input: RequiredObject<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  }) => Record<string, Output>;
  requiredActions?: RF;
  estimateGas?: (args: {
    input: RequiredObject<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
    vaultAddress: string;
    chainId: C;
  }) => string;
}) {
  return class SmartPlugin {
    public readonly chainId: C;
    public readonly name: A["name"] = abiFragment.name;
    public readonly vaultAddress: string;
    public readonly params: Params<A["inputs"]>;
    public readonly provider: ethers.providers.JsonRpcProvider;
    public static readonly id: `SmartPlugin_${PR}_${A["name"]}` = `SmartPlugin_${protocol}_${abiFragment.name}`;

    // Create a cache, where plugins from getPlugin are stored with the input as the key. stdLLL should be 3 minutes.
    public cache = new NodeCache({ stdTTL: 180 });

    constructor(args: {
      chainId: C;
      vaultAddress: string;
      rpcUrl?: string;
      provider?: ethers.providers.JsonRpcProvider;
      input?: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
    }) {
      this.chainId = args.chainId;
      this.vaultAddress = args.vaultAddress;
      this.params = (abiFragment.inputs || []).map((c) => new FunctionParameter(c)) as Params<A["inputs"]>;
      if (args.input) {
        this.set(args.input);
      }
      if (args.provider) {
        this.provider = args.provider;
      } else if (args.rpcUrl) {
        this.provider = new ethers.providers.JsonRpcProvider(args.rpcUrl);
      } else {
        throw new Error("No provider or rpcUrl passed");
      }
    }

    get id() {
      return SmartPlugin.id;
    }

    get inputs(): {
      get(): PluginFunctionInput<HandleUndefined<A["inputs"]>>;
      set(params: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>): void;
      // } & ParameterInputFromFragments<A["inputs"]> {
    } {
      // const params = this.params.reduce((acc, cur) => {
      //   return { ...acc, [cur.name]: cur.getWithMethods() };
      // }, {} as ParameterInputFromFragments<A["inputs"]>);
      return {
        // ...params,
        set: this.set.bind(this),
        get: this.get.bind(this),
      };
    }

    get inputTypes() {
      return abiFragment.inputs || [];
    }

    get outputs(): Record<string, Output> {
      if (prepareOutputs) {
        return prepareOutputs({ input: this.getStrict() });
      }
      return (
        abiFragment.outputs?.reduce((acc, cur, index) => {
          return { ...acc, [cur.name]: new Output({ innerIndex: index, name: cur.name, type: cur.type }) };
        }, {} as Record<string, Output>) || {}
      );
    }

    public estimateGas() {
      if (estimateGas) {
        return estimateGas({ input: this.getStrict(), chainId: this.chainId, vaultAddress: this.vaultAddress });
      }
      return undefined;
    }

    public set(params: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>) {
      Object.entries(params).forEach((p) => {
        const param = this.params.find((fp) => fp.name === p[0]);
        if (param) {
          param.set(p[1] as any);
        }
      });
    }

    public get() {
      return this.params.reduce((acc, cur) => {
        return { ...acc, [cur.name]: cur.get() };
      }, {} as PluginFunctionInput<HandleUndefined<A["inputs"]>>);
    }

    public getStrict() {
      return this.params.reduce((acc, cur) => {
        return { ...acc, [cur.name]: cur.getStrict() };
      }, {} as RequiredObject<PluginFunctionInput<HandleUndefined<A["inputs"]>>>);
    }

    public async getRequiredActions(): Promise<RequiredApproval[]> {
      if (requiredActions) {
        return requiredActions({ input: this.getStrict(), chainId: this.chainId, vaultAddress: this.vaultAddress });
      }
      return [];
    }

    public async getPlugin(): Promise<InstanceType<P[number]>> {
      const cached = this.cache.get(_getCacheKey(this));
      if (cached) {
        return cached as InstanceType<P[number]>;
      }
      const plugin = await prepare({
        input: this.getStrict(),
        chainId: this.chainId,
        vaultAddress: this.vaultAddress,
        provider: this.provider,
      });
      this.cache.set(_getCacheKey(this), plugin);
      return plugin;
    }

    public async create(): Promise<IPluginCall | undefined> {
      const cached = this.cache.get(_getCacheKey(this));
      if (cached) {
        return await (cached as InstanceType<P[number]>).create();
      }
      const plugin = await prepare({
        input: this.getStrict(),
        chainId: this.chainId,
        vaultAddress: this.vaultAddress,
        provider: this.provider,
      });
      const gas = this.estimateGas();
      if (gas) {
        plugin.setOptions({ gasLimit: (BigInt(gas) + 40000n).toString() });
      }
      this.cache.set(_getCacheKey(this), plugin);
      return await plugin.create();
    }

    public async simulate({ from }: { from: string }) {
      const plugin = await this.getPlugin();
      const signer = this.provider.getSigner(from);
      const contract = new ethers.Contract(plugin.contractAddress as string, [plugin.abiFragment], signer);
      const result = await contract.callStatic[plugin.method](...(plugin.get() as any));

      return {
        success: true,
        result,
      };
    }

    public async safeSimulate({ from }: { from: string }) {
      try {
        return await this.simulate({ from });
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

    static isSmartPlugin(): boolean {
      return true;
    }

    // static isSmartPluginOfSimplePlugin(data: IPluginCall) {
    //   const Plugin = supportedPlugins.find((p) => {
    //     const plugin = new p({ chainId: "1" });
    //     return plugin.isPlugin(data);
    //   });

    //   if (!Plugin) return false;
    //   return true;
    // }
  };
}

function _getCacheKey(plugin: any) {
  return JSON.stringify(plugin.get());
}

// Create SmartPlugin type
export type SmartPlugin = ReturnType<typeof createSmartPlugin>;
