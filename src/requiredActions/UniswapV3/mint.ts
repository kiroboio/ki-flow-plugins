import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { UniswapV3 } from "../../plugins";
import { createRequiredActionForPlugin } from "../requiredAction";

export const UniswapV3Mint = createRequiredActionForPlugin({
  plugin: UniswapV3.mint,
  requiredActions(args) {
    const from = args.vaultAddress;
    const {
      params: { token0, token1, amount0Desired, amount1Desired },
    } = args.input;

    if (
      isVariableOrUndefined(token1) ||
      isVariableOrUndefined(token0) ||
      isVariableOrUndefined(amount0Desired) ||
      isVariableOrUndefined(amount1Desired) ||
      isVariableOrUndefined(args.contractAddress)
    )
      return [];

    return [
      {
        to: token0,
        from,
        params: { spender: args.contractAddress, amount: amount0Desired },
        method: "approve",
        protocol: "ERC20",
      },
      {
        to: token1,
        from,
        params: { spender: args.contractAddress, amount: amount1Desired },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
