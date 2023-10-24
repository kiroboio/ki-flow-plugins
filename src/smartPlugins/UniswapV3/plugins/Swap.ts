import { Protocol } from "@uniswap/router-sdk";
import { TradeType } from "@uniswap/sdk-core";
import { AlphaRouter, CurrencyAmount, IV3RouteWithValidQuote } from "@uniswap/smart-order-router";
import { ethers } from "ethers";

import { Output } from "../../../Plugin/outputs";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { UniswapV3 } from "../../../plugins";
import { RequiredApproval } from "../../../types";
import { createToken, getPluginFromRoute } from "../helpers";

const abiFragment = {
  name: "Swap",
  inputs: [
    {
      components: [
        { name: "address", type: "address", canBeVariable: false },
        { name: "decimals", type: "uint16", canBeVariable: false },
      ],
      name: "fromToken",
      type: "tuple",
      appType: "Token",
    },
    {
      components: [
        { name: "address", type: "address", canBeVariable: false },
        { name: "decimals", type: "uint16", canBeVariable: false },
      ],
      name: "toToken",
      type: "tuple",
      appType: "Token",
    },
    {
      name: "amount",
      type: "uint256",
      canBeVariable: false,
    },
    {
      name: "isAmountIn",
      type: "bool",
      canBeVariable: false,
    },
    {
      name: "slippage",
      type: "uint256",
      canBeVariable: false,
    },
    {
      name: "recipient",
      type: "address",
      canBeVariable: false,
    },
  ],
} as const;

export const Swap = createSmartPlugin({
  protocol: "UniswapV3",
  supportedPlugins: [
    UniswapV3.exactInput,
    UniswapV3.exactInputSingle,
    UniswapV3.exactOutput,
    UniswapV3.exactOutputSingle,
  ],
  abiFragment,
  async prepare(args) {
    const { fromToken, toToken, amount, isAmountIn, recipient } = args.input;

    const { address: fromAddress, decimals: fromDecimals } = fromToken;
    const { address: toAddress, decimals: toDecimals } = toToken;
    const chainId = +args.chainId;

    const router = new AlphaRouter({ chainId, provider: args.provider });

    const TokenA = createToken({ address: fromAddress, decimals: +fromDecimals }, chainId);
    const TokenB = createToken({ address: toAddress, decimals: +toDecimals }, chainId);

    const [Base, Quote] = isAmountIn ? [TokenA, TokenB] : [TokenB, TokenA];

    const BaseAmount = CurrencyAmount.fromRawAmount(Base, amount);

    const swapRoute = await router.route(
      BaseAmount,
      Quote,
      isAmountIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
      undefined,
      {
        maxSwapsPerPath: 3,
        protocols: [Protocol.V3],
      }
    );

    // Path: route[0].route.path
    // RawQuote: route[0].rawQuote (if exactIn = output, if exactOut = input)
    // Amount: route[0].amount (if exactIn = input, if exactOut = output)
    // Gas estimate: route[0].gasEstimate

    if (!swapRoute) throw new Error("No route found");
    return getPluginFromRoute({
      chainId: args.chainId,
      isAmountIn,
      recipient,
      route: swapRoute.route[0] as IV3RouteWithValidQuote,
    });
  },
  requiredActions(args) {
    const { fromToken, amount } = args.input;
    const { address: fromAddress } = fromToken;

    // If fromAddress is native, return []
    if (fromAddress === ethers.constants.AddressZero) return [];

    const approvals: RequiredApproval[] = [
      {
        to: fromAddress,
        from: args.vaultAddress,
        params: { spender: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", amount },
        method: "approve",
        protocol: "ERC20",
      },
    ];

    return approvals;
  },
  prepareOutputs(args) {
    // If input.isAmountIn = true, then the output of the call is `amountOut`
    // else the output of the call is `amountIn`
    const { isAmountIn } = args.input;
    const name = isAmountIn ? "amountOut" : "amountIn";
    return {
      [name]: new Output({
        innerIndex: 0,
        name,
        type: "uint256",
      }),
    };
  },
});
