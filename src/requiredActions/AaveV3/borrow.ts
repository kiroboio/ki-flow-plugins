import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { AaveV2 } from "../../plugins";
import { AaveV3_aTokens } from "../../plugins/AaveV3/constants";
import { createRequiredActionForPlugin } from "../requiredAction";

export const AaveV3Borrow = createRequiredActionForPlugin({
  plugin: AaveV2.borrow,
  requiredActions(args) {
    const input = args.input;
    const { interestRateMode, onBehalfOf, asset, amount } = input;

    if (
      isVariableOrUndefined(interestRateMode) ||
      isVariableOrUndefined(onBehalfOf) ||
      isVariableOrUndefined(asset) ||
      isVariableOrUndefined(amount)
    )
      return [];

    // Find debt bearing token
    const token = AaveV3_aTokens.find(
      (token) => token.chainId === args.chainId && token.address.toLowerCase() === asset.toLowerCase()
    );
    if (!token) return [];

    return [
      {
        to: interestRateMode === "1" ? token.stableDebtTokenAddress : token.variableDebtTokenAddress,
        from: onBehalfOf,
        params: { delegatee: args.vaultAddress, amount },
        method: "approveDelegation",
        protocol: "AAVE",
      },
    ];
  },
});
