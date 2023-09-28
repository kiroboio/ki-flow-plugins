import { InstanceOf } from "../../../helpers/instanceOf";
import { createPluginWithRequiredActions } from "../../../Plugin/pluginWithRequiredActions";
import { AaveV2 } from "../../../plugins/AaveV2";
import { AaveV2_LendingPool_Addresses } from "../../../plugins/AaveV2/constants";

export const Repay = createPluginWithRequiredActions({
  plugin: AaveV2.repay,
  requiredActions(args) {
    const { amount, asset: to, onBehalfOf, rateMode } = args.input;

    if (!to || !amount || !onBehalfOf || !rateMode || InstanceOf.Variable(to) || InstanceOf.Variable(amount)) return [];

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
