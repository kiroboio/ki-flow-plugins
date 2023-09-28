import { isVariableOrUndefined } from "../../../helpers/instanceOf";
import { createPluginWithRequiredActions } from "../../../Plugin/pluginWithRequiredActions";
import { AaveV3 } from "../../../plugins/AaveV3";
import { AaveV3_Pool_Addresses } from "../../../plugins/AaveV3/constants";

export const Deposit = createPluginWithRequiredActions({
  plugin: AaveV3.deposit,
  requiredActions(args) {
    const { amount, asset: to } = args.input;
    if (isVariableOrUndefined(amount) || isVariableOrUndefined(to)) return [];

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
