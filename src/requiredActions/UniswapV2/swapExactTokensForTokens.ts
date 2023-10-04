import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { UniswapV2 } from "../../plugins";
import { createRequiredActionForPlugin } from "../requiredAction";

export const UniswapV2SwapExactTokensForTokens = createRequiredActionForPlugin({
  plugin: UniswapV2.swapExactTokensForTokens,
  requiredActions(args) {
    const from = args.vaultAddress;
    const { amountIn, path } = args.input;

    const inputToken = path[0];

    if (
      isVariableOrUndefined(amountIn) ||
      isVariableOrUndefined(inputToken) ||
      isVariableOrUndefined(args.contractAddress)
    )
      return [];

    return [
      {
        to: inputToken,
        from,
        params: { spender: args.contractAddress, amount: amountIn },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
