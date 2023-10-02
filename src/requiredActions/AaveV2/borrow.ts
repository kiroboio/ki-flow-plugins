import { isEqualAddress } from "../../helpers";
import { InstanceOf } from "../../helpers/instanceOf";
import { AaveV2 } from "../../plugins";
import { AaveV2_aTokens } from "../../plugins/AaveV2/constants";
import { createRequiredActionForPlugin } from "../requiredAction";

export const AaveV2Borrow = createRequiredActionForPlugin({
  plugin: AaveV2.borrow,
  requiredActions(args) {
    const input = args.input;
    const { interestRateMode, onBehalfOf, asset, amount } = input;

    if (
      !interestRateMode ||
      !onBehalfOf ||
      !asset ||
      !amount ||
      InstanceOf.Variable(asset) ||
      InstanceOf.Variable(amount)
    )
      return [];

    const token = AaveV2_aTokens.find(
      (token) => token.chainId === args.chainId && isEqualAddress(token.address, asset)
    );
    if (!token) return [];

    return [
      {
        // If interest rate mode 1, then we need to approve the stable debt token, else variable debt token
        to: interestRateMode === "1" ? token.stableDebtTokenAddress : token.variableDebtTokenAddress,
        from: onBehalfOf,
        params: { delegatee: args.vaultAddress, amount: amount },
        method: "approveDelegation",
        protocol: "AAVE",
      },
    ];
  },
});
