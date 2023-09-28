import { InstanceOf } from "../../../helpers/instanceOf";
import { createPluginWithRequiredActions } from "../../../Plugin/pluginWithRequiredActions";
import { AaveV2 } from "../../../plugins/AaveV2";
import { AaveV2_LendingPool_Addresses } from "../../../plugins/AaveV2/constants";

export const Deposit = createPluginWithRequiredActions({
  plugin: AaveV2.deposit,
  requiredActions(args) {
    const { amount, asset: to } = args.input;

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
