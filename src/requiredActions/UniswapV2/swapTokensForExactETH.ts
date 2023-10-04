import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { UniswapV2 } from "../../plugins";
import { createRequiredActionForPlugin } from "../requiredAction";

export const UniswapV2SwapTokensForExactETH = createRequiredActionForPlugin({
  plugin: UniswapV2.swapTokensForExactETH,
  requiredActions(args) {
    const from = args.vaultAddress;
    const { amountInMax, path } = args.input;

    const inputToken = path[0];

    if (
      isVariableOrUndefined(amountInMax) ||
      isVariableOrUndefined(inputToken) ||
      isVariableOrUndefined(args.contractAddress)
    )
      return [];

    return [
      {
        to: inputToken,
        from,
        params: { spender: args.contractAddress, amount: amountInMax },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
