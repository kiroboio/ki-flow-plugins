import { ChainId, HandleUndefined, IPluginCall, JsonFragment, PluginFunctionInput, RequiredApproval } from "../types";
import { Output } from "./outputs";
import { FunctionParameter } from "./parameter";
import { Plugin } from "./plugin";

// TODO: Functions that need to be added:
// - add output options
// - required actions before the action
// Optional:
// - optional helpers when constructing plugin (for example, cache for Uniswap).
// After talking with Sumbat - not mandatory.

export function createSmartPlugin<A extends JsonFragment = JsonFragment, C extends ChainId = ChainId>({
  prepare,
  abiFragment,
  prepareOutputs,
  requiredActions,
}: {
  prepare: (args: {
    input: PluginFunctionInput<HandleUndefined<A["inputs"]>>;
    vaultAddress: string;
    chainId: C;
  }) => Promise<InstanceType<Plugin<any>>>;
  abiFragment: A;
  prepareOutputs?: (args: { input: PluginFunctionInput<HandleUndefined<A["inputs"]>> }) => Record<string, Output>;
  requiredActions?: (args: {
    input: PluginFunctionInput<HandleUndefined<A["inputs"]>>;
    vaultAddress: string;
    chainId: C;
  }) => RequiredApproval[];
}) {
  return class SmartPlugin {
    public readonly name: A["name"] = abiFragment.name;
    public readonly chainId: C;
    public readonly vaultAddress: string;
    public readonly params: readonly FunctionParameter[] = [];

    constructor(args: { chainId: C; vaultAddress: string }) {
      this.chainId = args.chainId;
      this.vaultAddress = args.vaultAddress;
      this.params = abiFragment.inputs?.map((c) => new FunctionParameter(c)) || [];
    }

    get outputs(): Record<string, Output> {
      if (prepareOutputs) {
        return prepareOutputs({ input: this.get() });
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

    public getRequiredActions(): RequiredApproval[] {
      if (!requiredActions) return [];
      return requiredActions({ input: this.get(), chainId: this.chainId, vaultAddress: this.vaultAddress });
    }

    public async create(): Promise<IPluginCall | undefined> {
      const plugin = await prepare({
        input: this.get(),
        chainId: this.chainId,
        vaultAddress: this.vaultAddress,
      });
      return await plugin.create();
    }
  };
}
