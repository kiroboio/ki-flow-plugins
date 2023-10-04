import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { UniswapV3 } from "../../plugins";
import { createRequiredActionForPlugin } from "../requiredAction";

export const UniswapV3ExactInputSingle = createRequiredActionForPlugin({
  plugin: UniswapV3.exactInputSingle,
  requiredActions(args) {
    const from = args.vaultAddress;
    const {
      params: { amountIn, tokenIn },
    } = args.input;

    if (
      isVariableOrUndefined(amountIn) ||
      isVariableOrUndefined(args.contractAddress) ||
      isVariableOrUndefined(tokenIn)
    )
      return [];

    return [
      {
        to: tokenIn,
        from,
        params: { spender: args.contractAddress, amount: amountIn },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
