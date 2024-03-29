import { Ether, Token } from "@uniswap/sdk-core";
import { IV2RouteWithValidQuote } from "@uniswap/smart-order-router";
import { ethers } from "ethers";

import { UniswapV2 } from "../../plugins";
import { ChainId } from "../../types";

export function createToken(token: { address: string; decimals: number }, chainId: number) {
  if (token.address === ethers.constants.AddressZero) {
    return Ether.onChain(chainId);
  }
  return new Token(chainId, token.address, +token.decimals);
}

export const getPluginFromRoute = ({
  fromToken,
  toToken,
  chainId,
  route,
  isAmountIn,
  recipient,
}: {
  fromToken: Token | Ether;
  toToken: Token | Ether;
  chainId: ChainId;
  route: IV2RouteWithValidQuote;
  isAmountIn: boolean;
  recipient: string;
}) => {
  // If isExactIn = true, amount is from, rawQuote is to
  // If isExactIn = false, amount is to, rawQuote is from
  const path = route.route.path.map((token) => token.address);
  const deadline = Math.floor(Date.now() / 1000 + 1800).toString();
  if (isAmountIn) {
    const inputAmount = route.amount.quotient.toString();
    const outputAmount = route.quote.quotient.toString();

    // If input currency is native, then the plugin should be swapExactETHForTokens
    if (fromToken.isNative) {
      const plugin = new UniswapV2.swapExactETHForTokens({
        chainId,
        input: {
          amountOutMin: outputAmount,
          deadline,
          path,
          to: recipient,
        },
      });
      plugin.setValue(inputAmount);
      plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });
      return plugin;
    }
    // If output currency is native, then the plugin should be swapExactTokensForETH
    if (toToken.isNative) {
      const plugin = new UniswapV2.swapExactTokensForETH({
        chainId,
        input: {
          amountIn: inputAmount,
          amountOutMin: outputAmount,
          deadline,
          path,
          to: recipient,
        },
      });
      plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });
      return plugin;
    }
    // Else the plugin should be swapExactTokensForTokens
    const plugin = new UniswapV2.swapExactTokensForTokens({
      chainId,
      input: {
        amountIn: inputAmount,
        amountOutMin: outputAmount,
        deadline,
        path,
        to: recipient,
      },
    });
    plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });
    return plugin;
  }

  const inputAmount = route.quote.quotient.toString();
  const outputAmount = route.amount.quotient.toString();

  // If input currency is native, then the plugin should be swapTokensForExactETH
  if (fromToken.isNative) {
    const plugin = new UniswapV2.swapETHForExactTokens({
      chainId,
      input: {
        amountOut: outputAmount,
        deadline,
        path,
        to: recipient,
      },
    });
    plugin.setValue(inputAmount);
    plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });
    return plugin;
  }

  // If output currency is native, then the plugin should be swapExactTokensForETH
  if (toToken.isNative) {
    const plugin = new UniswapV2.swapTokensForExactETH({
      chainId,
      input: {
        amountInMax: inputAmount,
        amountOut: outputAmount,
        deadline,
        path,
        to: recipient,
      },
    });
    plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });
    return plugin;
  }

  // Else the plugin should be swapTokensForExactTokens
  const plugin = new UniswapV2.swapTokensForExactTokens({
    chainId,
    input: {
      amountInMax: inputAmount,
      amountOut: outputAmount,
      deadline,
      path,
      to: recipient,
    },
  });
  plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });
  return plugin;
};
