import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { UniswapV2 } from "../../plugins";
import { createRequiredActionForPlugin } from "../requiredAction";

export const UniswapV2SwapExactTokensForETH = createRequiredActionForPlugin({
  plugin: UniswapV2.swapExactTokensForETH,
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
