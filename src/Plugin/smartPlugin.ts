import { ethers } from "ethers";
import NodeCache from "node-cache";

import { parseParams } from "../helpers/parseParams";
import {
  ChainId,
  EnhancedJsonFragment,
  HandleUndefined,
  IPluginCall,
  PluginFunctionInput,
  RequiredApproval,
  RequiredObject,
} from "../types";
import { Output } from "./outputs";
import { FunctionParameter } from "./parameter";
import { Plugin } from "./plugin";

// TODO: Functions that need to be added:
// Optional:
// - optional helpers when constructing plugin (for example, cache for Uniswap). After talking with Sumbat - not mandatory.

// TODO: For now the cache and _getCacheKey are public, should be made private in the future.

/* Issues that came into my mind:
 * - Should we still have the getPlugin function? If yes then we might have 2 problems - how to get required actions and how to run the getPlugin from EIP712 data
 * - Some Smart plugins may require to get plugin from 'prepare' to correctly get 'requiredActions'.
 */

type RequiredActionsFunction<C extends ChainId, A extends EnhancedJsonFragment> = (args: {
  input: RequiredObject<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  vaultAddress: string;
  chainId: C;
}) => RequiredApproval[];

export function createSmartPlugin<
  P extends readonly Plugin<any>[] = readonly Plugin<any>[],
  A extends EnhancedJsonFragment = EnhancedJsonFragment,
  C extends ChainId = ChainId,
  RF extends RequiredActionsFunction<C, A> = RequiredActionsFunction<C, A>
>({
  supportedPlugins,
  prepare,
  abiFragment,
  prepareOutputs,
  requiredActions,
  requiredActionsFromPlugin,
}: {
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
  requiredActionsFromPlugin?: (args: {
    plugin: InstanceType<P[number]>;
    requiredActions?: RF;
    vaultAddress: string;
    chainId: C;
  }) => RequiredApproval[];
  // }): new (args: { chainId: C; vaultAddress: string; provider: ethers.providers.JsonRpcProvider }) => ISmartPlugin<A, C> {
}) {
  return class {
    public readonly name: A["name"] = abiFragment.name;
    public readonly chainId: C;
    public readonly vaultAddress: string;
    public readonly params: readonly FunctionParameter[] = [];
    public readonly provider: ethers.providers.JsonRpcProvider;

    // Create a cache, where plugins from getPlugin are stored with the input as the key. stdLLL should be 3 minutes.
    public cache = new NodeCache({ stdTTL: 180 });

    constructor(args: { chainId: C; vaultAddress: string; provider: ethers.providers.JsonRpcProvider }) {
      this.chainId = args.chainId;
      this.vaultAddress = args.vaultAddress;
      this.params = abiFragment.inputs?.map((c) => new FunctionParameter(c)) || [];
      this.provider = args.provider;
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

    // Create a function that returns the same as get, but it checks if the value is undefined and if it is, it throws an error.
    public getStrict() {
      return this.params.reduce((acc, cur) => {
        return { ...acc, [cur.name]: cur.getStrict() };
      }, {} as RequiredObject<PluginFunctionInput<HandleUndefined<A["inputs"]>>>);
    }

    public async getRequiredActions(): Promise<RequiredApproval[]> {
      if (requiredActions) {
        return requiredActions({ input: this.getStrict(), chainId: this.chainId, vaultAddress: this.vaultAddress });
      } else if (requiredActionsFromPlugin) {
        const plugin = await this.getPlugin();
        return requiredActionsFromPlugin({
          plugin: plugin as InstanceType<P[number]>,
          chainId: this.chainId,
          vaultAddress: this.vaultAddress,
        });
      }
      return [];
    }

    public getRequiredActionsFromCall(call: IPluginCall): RequiredApproval[] {
      if (!requiredActionsFromPlugin) throw new Error("requiredActionsFromPlugin not defined");

      const Plugin = supportedPlugins.find((p) => {
        const plugin = new p({ chainId: "1" });
        return plugin.isPlugin(call);
      });
      if (!Plugin) throw new Error("Plugin not supported for this data");
      const plugin = new Plugin({
        chainId: "1",
        input: parseParams(call.params),
        contractAddress: typeof call.to === "string" ? call.to : undefined,
      });

      return requiredActionsFromPlugin({
        plugin: plugin as InstanceType<P[number]>,
        chainId: this.chainId,
        vaultAddress: this.vaultAddress,
      });
    }

    public async getPlugin(): Promise<InstanceType<P[number]>> {
      const cached = this.cache.get(this._getCacheKey());
      if (cached) {
        return cached as InstanceType<P[number]>;
      }
      const plugin = await prepare({
        input: this.getStrict(),
        chainId: this.chainId,
        vaultAddress: this.vaultAddress,
        provider: this.provider,
      });
      this.cache.set(this._getCacheKey(), plugin);
      return plugin;
    }

    public async create(): Promise<IPluginCall | undefined> {
      const cached = this.cache.get(this._getCacheKey());
      if (cached) {
        return await (cached as InstanceType<P[number]>).create();
      }
      const plugin = await prepare({
        input: this.getStrict(),
        chainId: this.chainId,
        vaultAddress: this.vaultAddress,
        provider: this.provider,
      });
      this.cache.set(this._getCacheKey(), plugin);
      return await plugin.create();
    }

    public _getCacheKey() {
      return JSON.stringify(this.get());
    }

    static isSmartPlugin(data: IPluginCall) {
      const Plugin = supportedPlugins.find((p) => {
        const plugin = new p({ chainId: "1" });
        return plugin.isPlugin(data);
      });

      if (!Plugin) return false;
      return true;
    }
  };
}

// Create a interface/type for the class that is returned in createSmartPlugin.

export interface ISmartPlugin<A extends EnhancedJsonFragment = EnhancedJsonFragment, C extends ChainId = ChainId> {
  readonly name: A["name"];
  readonly chainId: C;
  readonly vaultAddress: string;
  readonly params: readonly FunctionParameter[];
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly cache: NodeCache;
  outputs: Record<string, Output>;
  set(params: Partial<PluginFunctionInput<HandleUndefined<A["inputs"]>>>): void;
  get(): PluginFunctionInput<HandleUndefined<A["inputs"]>>;
  getStrict(): RequiredObject<PluginFunctionInput<HandleUndefined<A["inputs"]>>>;
  getRequiredActions(): RequiredApproval[];
  getPlugin(): Promise<InstanceType<Plugin<any>>>;
  create(): Promise<IPluginCall | undefined>;
  _getCacheKey(): string;
}
