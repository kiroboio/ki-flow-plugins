import { Output } from "../../../Plugin/outputs";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { Multicall } from "../../../plugins";

const abiFragment = {
  name: "SmartMultiAllowance",
  inputs: [
    {
      components: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowances",
      type: "tuple[]",
    },
  ],
} as const;

export const SmartMultiAllowance = createSmartPlugin({
  abiFragment,
  async prepare(args) {
    return new Multicall.multiAllowance({
      chainId: args.chainId,
      input: args.input,
    });
  },
  prepareOutputs(args) {
    const balances = args.input.allowances;
    return balances.reduce((acc, _, index) => {
      const name = `balance_${index}`;
      return { ...acc, [name]: new Output({ innerIndex: index + 2, name, type: "uint256" }) };
    }, {} as Record<string, Output>);
  },
});
