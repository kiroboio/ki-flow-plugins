import { Output } from "../../Plugin/outputs";
import { createSmartPlugin } from "../../Plugin/smartPlugin";
import { Multicall } from "../../plugins";

const abiFragment = {
  name: "SmartMultiBalance",
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
          name: "account",
          type: "address",
        },
      ],
      internalType: "struct Balance[]",
      name: "balances",
      type: "tuple[]",
    },
  ],
} as const;

export const SmartMultiBalance = createSmartPlugin({
  abiFragment,
  async prepare(args) {
    return new Multicall.multiBalance({
      chainId: args.chainId,
      input: args.input,
    });
  },
  prepareOutputs(args) {
    const balances = args.input.balances;
    return balances.reduce((acc, _, index) => {
      const name = `balance_${index}`;
      return { ...acc, [name]: new Output({ innerIndex: index + 2, name, type: "uint256" }) };
    }, {} as Record<string, Output>);
  },
});
