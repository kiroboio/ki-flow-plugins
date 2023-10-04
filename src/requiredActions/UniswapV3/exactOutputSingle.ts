import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { UniswapV3 } from "../../plugins";
import { createRequiredActionForPlugin } from "../requiredAction";

export const UniswapV3ExactOutputSingle = createRequiredActionForPlugin({
  plugin: UniswapV3.exactOutputSingle,
  requiredActions(args) {
    const from = args.vaultAddress;
    const {
      params: { amountInMaximum, tokenIn },
    } = args.input;

    if (
      isVariableOrUndefined(amountInMaximum) ||
      isVariableOrUndefined(args.contractAddress) ||
      isVariableOrUndefined(tokenIn)
    )
      return [];

    return [
      {
        to: tokenIn,
        from,
        params: { spender: args.contractAddress, amount: amountInMaximum },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
