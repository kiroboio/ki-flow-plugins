import { ERC20 } from "../plugins";
import { ChainId, HandleUndefined, IPluginCall, JsonFragment, PluginFunctionInput } from "../types";
import { FunctionParameter } from "./parameter";
import { Plugin } from "./plugin";

export function createSmartPlugin<P extends Plugin<JsonFragment>, A extends JsonFragment, C extends ChainId>({
  prepare,
  plugins,
  abiFragment,
}: {
  prepare: (args: {
    input: PluginFunctionInput<HandleUndefined<A["inputs"]>>;
    vaultAddress: string;
    chainId: C;
  }) => Promise<InstanceType<P>>;
  plugins: readonly P[];
  abiFragment: A;
}) {
  return class SmartPlugin {
    public readonly plugins: readonly P[] = plugins;
    public readonly name: A["name"] = abiFragment.name;
    public readonly chainId: C;
    public readonly vaultAddress: string;
    public readonly params: readonly FunctionParameter[] = [];

    constructor(args: { chainId: C; vaultAddress: string }) {
      this.chainId = args.chainId;
      this.vaultAddress = args.vaultAddress;
      this.params = abiFragment.inputs?.map((c) => new FunctionParameter(c)) || [];
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
      const plugin = await prepare({
        input: this.get(),
        chainId: this.chainId,
        vaultAddress: this.vaultAddress,
      });
      return await plugin.create();
    }
  };
}

// Example of SmartTransfer plugin
const SmartTransfer = createSmartPlugin({
  abiFragment: {
    name: "smartTransfer",
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    payable: false,
  } as const,
  plugins: [ERC20.transfer, ERC20.transferFrom],
  async prepare(args) {
    if (args.vaultAddress === args.input.from) {
      return new ERC20.transfer({
        chainId: args.chainId,
        input: {
          to: args.input.to,
          value: args.input.amount,
        },
      });
    }
    return new ERC20.transferFrom({
      chainId: args.chainId,
      input: {
        from: args.input.from,
        to: args.input.to,
        value: args.input.amount,
      },
    });
  },
  // TODO: add output options, optional helpers when constructing plugin (for example, cache for Uniswap)
});
