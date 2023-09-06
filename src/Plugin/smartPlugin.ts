import { ERC20 } from "../plugins";
import { ChainId, HandleUndefined, JsonFragment, PluginFunctionInput } from "../types";
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
  }) => InstanceType<P>;
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

    public create() {
      const plugin = prepare({
        input: this.get(),
        chainId: this.chainId,
        vaultAddress: this.vaultAddress,
      });
      return plugin;
    }
  };
}

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
  } as const,
  plugins: [ERC20.transfer, ERC20.transferFrom],
  prepare(args) {
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
});

const plugin = new SmartTransfer({ chainId: "1", vaultAddress: "0x" });

plugin.set({
  amount: "100",
  from: "0x",
  to: "0x",
});
