import { Ether, Token } from "@uniswap/sdk-core";
import { IV3RouteWithValidQuote } from "@uniswap/smart-order-router";
import { ethers } from "ethers";

import { UniswapV3 } from "../../plugins";
import { ChainId } from "../../types";

export function createToken(token: { address: string; decimals: number }, chainId: number) {
  if (token.address === ethers.constants.AddressZero) {
    return Ether.onChain(chainId);
  }
  return new Token(chainId, token.address, +token.decimals);
}

function buildPath({ path, pools }: { path: string[]; pools: IV3RouteWithValidQuote["route"]["pools"] }) {
  return path.reduce((acc, cur, index) => {
    if (index === 0) {
      return acc + cur;
    }
    return acc + pools[index - 1].fee.toString() + cur;
  }, "");
}

export const getPluginFromRoute = ({
  chainId,
  route,
  isAmountIn,
  recipient,
}: {
  chainId: ChainId;
  route: IV3RouteWithValidQuote;
  isAmountIn: boolean;
  recipient: string;
}) => {
  // If isExactIn = true, amount is from, rawQuote is to
  // If isExactIn = false, amount is to, rawQuote is from
  const path = route.route.tokenPath.map((token) => token.address);
  const pools = route.route.pools;
  const deadline = Math.floor(Date.now() / 1000 + 1800).toString();

  if (isAmountIn) {
    const input = route.amount;
    const output = route.quote;
    const inputAmount = input.quotient.toString();
    const outputAmount = output.quotient.toString();

    // If path.length === 2, then the plugin should be exactInputSingle
    if (path.length === 2) {
      const plugin = new UniswapV3.exactInputSingle({
        chainId,
        input: {
          params: {
            amountIn: inputAmount,
            amountOutMinimum: outputAmount,
            fee: pools[0].fee.toString(),
            recipient,
            sqrtPriceLimitX96: "0",
            tokenIn: path[0],
            tokenOut: path[1],
            deadline,
          },
        },
      });
      // If he inputs is native, we set the value
      if (input.currency.isNative) {
        plugin.setValue(inputAmount);
      }
      plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });
    }

    // If the path is > 2, then the plugin should be exactInput
    const plugin = new UniswapV3.exactInput({
      chainId,
      input: {
        params: {
          amountIn: inputAmount,
          amountOutMinimum: outputAmount,
          path: buildPath({ path, pools }),
          recipient,
          deadline,
        },
      },
    });

    if (input.currency.isNative) {
      plugin.setValue(inputAmount);
    }
    plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });

    return plugin;
  }

  // Else user specified amount out
  const input = route.quote;
  const output = route.amount;
  const inputAmount = input.quotient.toString();
  const outputAmount = output.quotient.toString();

  // If path.length === 2, then the plugin should be exactOutputSingle
  if (path.length === 2) {
    const plugin = new UniswapV3.exactOutputSingle({
      chainId,
      input: {
        params: {
          amountInMaximum: inputAmount,
          amountOut: outputAmount,
          fee: pools[0].fee.toString(),
          recipient,
          sqrtPriceLimitX96: "0",
          tokenIn: path[0],
          tokenOut: path[1],
          deadline,
        },
      },
    });
    // If he inputs is native, we set the value
    if (input.currency.isNative) {
      plugin.setValue(inputAmount);
    }
    plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });
    return plugin;
  }

  // the path is > 2, plugin should be exactOutput
  const plugin = new UniswapV3.exactOutput({
    chainId,
    input: {
      params: {
        amountInMaximum: inputAmount,
        amountOut: outputAmount,
        path: buildPath({ path, pools }),
        recipient,
        deadline,
      },
    },
  });

  if (input.currency.isNative) {
    plugin.setValue(inputAmount);
  }
  plugin.setOptions({ gasLimit: route.gasEstimate.add(50000).toString() });

  return plugin;
};
