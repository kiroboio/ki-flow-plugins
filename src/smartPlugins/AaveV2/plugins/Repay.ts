import { InstanceOf } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { AaveV2 } from "../../../plugins";
import { AaveV2_LendingPool_Addresses } from "../../../plugins/AaveV2/constants";

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
      options: ["1", "2"],
    },
    {
      name: "onBehalfOf",
      type: "address",
    },
  ],
} as const;

export const Repay = createSmartPlugin({
  protocol: "AaveV2",
  supportedPlugins: [AaveV2.repay],
  abiFragment,
  async prepare(args) {
    return new AaveV2.repay({
      chainId: args.chainId,
      input: args.input,
    });
  },
  requiredActions(args) {
    const { amount, asset: to } = args.input;
    if (InstanceOf.Variable(amount)) return [];

    const spender = AaveV2_LendingPool_Addresses.find((address) => address.chainId === args.chainId);
    if (!spender) throw new Error("No AaveV2 lending pool address found for this chainId");
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
