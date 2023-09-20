import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { ERC20 } from "../../../plugins";

const abiFragment = {
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
} as const;

export const SmartTransfer = createSmartPlugin({
  supportedPlugins: [ERC20.transfer, ERC20.transferFrom],
  abiFragment,
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
});
