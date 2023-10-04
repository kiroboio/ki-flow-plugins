import { UniswapV2SwapExactTokensForETH } from "./swapExactTokensForETH";
import { UniswapV2SwapExactTokensForTokens } from "./swapExactTokensForTokens";
import { UniswapV2SwapTokensForExactETH } from "./swapTokensForExactETH";
import { UniswapV2SwapTokensForExactTokens } from "./swapTokensForExactTokens";

export const UniswapV2RequiredActions = [
  UniswapV2SwapExactTokensForETH,
  UniswapV2SwapExactTokensForTokens,
  UniswapV2SwapTokensForExactETH,
  UniswapV2SwapTokensForExactTokens,
];
