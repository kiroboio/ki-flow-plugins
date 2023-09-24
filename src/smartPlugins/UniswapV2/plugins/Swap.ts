import { Protocol } from "@uniswap/router-sdk";
import { TradeType } from "@uniswap/sdk-core";
import { AlphaRouter, CurrencyAmount, IV2RouteWithValidQuote } from "@uniswap/smart-order-router";
import { ethers } from "ethers";

import { InstanceOf, isVariableOrUndefined } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { UniswapV2 } from "../../../plugins";
import { RequiredApproval } from "../../../types";
import { createToken, getPluginFromRoute } from "../helpers";

const abiFragment = {
  name: "Swap",
  inputs: [
    {
      components: [
        { name: "address", type: "address", canBeVariable: false },
        { name: "decimals", type: "address", canBeVariable: false },
      ],
      name: "from",
      type: "tuple",
    },
    {
      components: [
        { name: "address", type: "address", canBeVariable: false },
        { name: "decimals", type: "address", canBeVariable: false },
      ],
      name: "to",
      type: "tuple",
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
  supportedPlugins: [
    UniswapV2.swapETHForExactTokens,
    UniswapV2.swapExactETHForTokens,
    UniswapV2.swapTokensForExactETH,
    UniswapV2.swapExactTokensForETH,
    UniswapV2.swapTokensForExactTokens,
    UniswapV2.swapExactTokensForTokens,
  ],
  abiFragment,
  async prepare(args) {
    const { from, to, amount, isAmountIn, recipient } = args.input;

    const { address: fromAddress, decimals: fromDecimals } = from;
    const { address: toAddress, decimals: toDecimals } = to;
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
        protocols: [Protocol.V2],
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
      route: swapRoute.route[0] as IV2RouteWithValidQuote,
    });
  },
  requiredActions(args) {
    const { from, amount } = args.input;
    const { address: fromAddress } = from;

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
  requiredActionsFromPlugin(args) {
    const method = args.plugin.method;
    let toVal;
    let amountVal;
    if (method === "swapExactTokensForETH" || method === "swapExactTokensForTokens") {
      const input = args.plugin.get();
      if (InstanceOf.Variable(input.amountIn)) return [];
      toVal = input.path[0];
      amountVal = input.amountIn;
    }
    if (method === "swapTokensForExactETH" || method === "swapTokensForExactTokens") {
      const input = args.plugin.get();
      if (InstanceOf.Variable(input.amountInMax)) return [];
      toVal = input.path[0];
      amountVal = input.amountInMax;
    }

    if (isVariableOrUndefined(toVal) || isVariableOrUndefined(amountVal)) return [];

    return [
      {
        to: toVal,
        from: args.vaultAddress,
        params: { spender: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", amount: amountVal },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});

// Below is a test for this Swap plugin
// const plugin = new SmartPlugins.UniswapV2.Swap({
//   chainId: "1",
//   provider: new ethers.providers.JsonRpcProvider(
//     "https://eth-mainnet.g.alchemy.com/v2/<key>"
//   ),
//   vaultAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
// });

// plugin.set({
//   from: {
//     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC,
//     decimals: "6",
//   },
//   to: {
//     address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
//     decimals: "18",
//   },
//   amount: "1600" + "0".repeat(6),
//   isExactIn: true,
//   recipient: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
//   slippage: "500",
// });

// const create = await plugin.create();

// if (!create) return;

// const UniInterface = new ethers.utils.Interface(UniswapV2Abi);

// // USDC Whale 0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503

// const calls = [
//   {
//     from: "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503",
//     to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",

//     data: Interfaces.ERC20.encodeFunctionData("approve", [
//       "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
//       "2000" + "0".repeat(6),
//     ]),
//   },
//   {
//     from: "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503",
//     to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
//     data: UniInterface.encodeFunctionData(
//       create.method,
//       create.params.map((param) => param.value)
//     ),
//   },
// ];

// const res = await fetch("https://mainnet.gateway.tenderly.co/<key>", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     id: 0,
//     jsonrpc: "2.0",
//     method: "tenderly_simulateBundle",
//     params: [calls, "latest"],
//   }),
// });
// const data = await res.json();

// console.log(JSON.stringify(data, null, 2));
