import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { AaveV2 } from "../../plugins";
import { AaveV3_Pool_Addresses } from "../../plugins/AaveV3/constants";
import { createRequiredActionForPlugin } from "../requiredAction";

export const AaveV3Deposit = createRequiredActionForPlugin({
  plugin: AaveV2.deposit,
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
