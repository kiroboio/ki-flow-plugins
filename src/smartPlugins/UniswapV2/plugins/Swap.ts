import { Protocol } from "@uniswap/router-sdk";
import { Percent, TradeType } from "@uniswap/sdk-core";
import { AlphaRouter, CurrencyAmount, SwapType } from "@uniswap/smart-order-router";
import { ethers } from "ethers";

import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { UniswapV2 } from "../../../plugins";
import { createToken, handleInput } from "../helpers";

const UniswapRouter02ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bytes[]", name: "data", type: "bytes[]" },
    ],
    name: "multicall",
    outputs: [{ internalType: "bytes[]", name: "", type: "bytes[]" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "swapExactTokensForTokens",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "amountInMax", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "swapTokensForExactTokens",
    outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapETHForExactTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapExactETHForTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForETH",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountInMax",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapTokensForExactETH",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const abiFragment = {
  name: "Supply",
  inputs: [
    {
      components: [
        { name: "address", type: "address" },
        { name: "decimals", type: "address" },
      ],
      name: "from",
      type: "tuple",
    },
    {
      components: [
        { name: "address", type: "address" },
        { name: "decimals", type: "address" },
      ],
      name: "to",
      type: "tuple",
    },
    {
      name: "amount",
      type: "uint256",
    },
    {
      name: "isExactIn",
      type: "bool",
    },
    {
      name: "slippage",
      type: "uint256",
    },
    {
      name: "recipient",
      type: "address",
    },
  ],
} as const;

export const Swap = createSmartPlugin({
  abiFragment,
  async prepare(args) {
    const { from, to, amount, isExactIn, slippage, recipient } = args.input;
    const { address: fromAddress, decimals: fromDecimals } = from;
    const { address: toAddress, decimals: toDecimals } = to;
    if (
      !fromAddress ||
      !fromDecimals ||
      !toAddress ||
      !toDecimals ||
      !amount ||
      !isExactIn ||
      !slippage ||
      !recipient
    ) {
      throw new Error("Invalid input");
    }
    const chainId = +args.chainId;

    const router = new AlphaRouter({ chainId, provider: args.provider });

    const TokenA = createToken({ address: fromAddress, decimals: +fromDecimals }, chainId);
    const TokenB = createToken({ address: toAddress, decimals: +toDecimals }, chainId);

    const [Base, Quote] = isExactIn ? [TokenA, TokenB] : [TokenB, TokenA];

    const BaseAmount = CurrencyAmount.fromRawAmount(Base, amount);
    const deadline = Math.floor(Date.now() / 1000 + 1800);

    const swapRoute = await router.route(
      BaseAmount,
      Quote,
      isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
      {
        slippageTolerance: new Percent(50, 100_00),
        recipient,
        deadline,
        type: SwapType.SWAP_ROUTER_02,
      },
      {
        maxSwapsPerPath: 3,
        protocols: [Protocol.V2],
      }
    );

    if (!swapRoute) throw new Error("No route found");

    const data = swapRoute.methodParameters?.calldata;
    if (!data) throw new Error("Failed to generate client side quote");

    // Decode data, which is multicall call
    const UniswapV2Router02 = new ethers.utils.Interface(UniswapRouter02ABI);
    const result = UniswapV2Router02.parseTransaction({
      data,
    });

    const innerCalldata = result.args.data[0];
    const result2 = UniswapV2Router02.parseTransaction({
      data: innerCalldata,
    });

    const result2Function = result2.functionFragment;
    const resultArgs = handleInput(result2.args as any);

    const method = result2Function.name;
    // const value = TokenA.isNative ? (resultArgs.amountIn || resultArgs.amountInMax).toString() : "0";

    // Find the Uniswap V2 plugins
    const plugin = new UniswapV2[method as keyof typeof UniswapV2]({
      chainId: args.chainId,
      input: { ...resultArgs, deadline: deadline.toString() },
    });

    plugin.setOptions({
      gasLimit: swapRoute.estimatedGasUsed.add(50000).toString(),
    });

    // If from is ETH, we set the value on plugin
    if (TokenA.isNative) {
      plugin.setValue(result2.value.toString() as never);
    }
    return plugin;
  },
});
