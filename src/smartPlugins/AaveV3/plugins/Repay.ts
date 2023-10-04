import { InstanceOf } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { AaveV3 } from "../../../plugins";
import { AaveV3_Pool_Addresses } from "../../../plugins/AaveV3/constants";

const abiFragment = {
  name: "Repay",
  inputs: [
    {
      name: "asset",
      type: "address",
    },
    {
      name: "amount",
      type: "uint256",
    },
    {
      name: "rateMode",
      type: "uint256",
    },
    {
      name: "onBehalfOf",
      type: "address",
    },
  ],
} as const;

export const Repay = createSmartPlugin({
  supportedPlugins: [AaveV3.repay],
  abiFragment,
  async prepare(args) {
    return new AaveV3.repay({
      chainId: args.chainId,
      input: args.input,
    });
  },
  requiredActions(args) {
    const { amount, asset: to } = args.input;
    if (InstanceOf.Variable(amount)) return [];

    const spender = AaveV3_Pool_Addresses.find((address) => address.chainId === args.chainId);
    if (!spender) throw new Error("No Aave V3 pool address found for this chainId");
    return [
      {
        to,
        from: args.vaultAddress,
        params: { spender: spender.address, amount },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
