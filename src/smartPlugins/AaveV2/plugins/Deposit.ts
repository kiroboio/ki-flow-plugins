import { InstanceOf } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { AaveV2 } from "../../../plugins";
import { AaveV2_LendingPool_Addresses } from "../../../plugins/AaveV2/constants";

const abiFragment = {
  name: "Deposit",
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
      name: "onBehalfOf",
      type: "address",
    },
  ],
} as const;

export const Deposit = createSmartPlugin({
  supportedPlugins: [AaveV2.deposit],
  abiFragment,
  async prepare(args) {
    return new AaveV2.deposit({
      chainId: args.chainId,
      input: { ...args.input, referralCode: "0" },
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
  requiredActionsFromPlugin(args) {
    const { amount, asset: to } = args.plugin.get();

    if (!to || !amount || InstanceOf.Variable(amount) || InstanceOf.Variable(to)) return [];

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
