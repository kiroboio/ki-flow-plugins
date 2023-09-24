import { ethers } from "ethers";

import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { UniswapV2 } from "../../../plugins";
import { UniswapV2_Factory, UniswapV2_Router } from "../../../plugins/UniswapV2/constants";

const abiFragment = {
  name: "RemoveLiquidity",
  inputs: [
    {
      name: "poolAddress",
      type: "address",
      canBeVariable: false,
    },
    {
      name: "amount",
      type: "uint256",
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

// TODO: This can be greatly improved with multicalls
export const RemoveLiquidity = createSmartPlugin({
  supportedPlugins: [UniswapV2.removeLiquidity],
  abiFragment,
  async prepare(args) {
    const { input } = args;

    const pool = new ethers.Contract(
      input.poolAddress,
      [
        "function totalSupply() view returns (uint256)",
        "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        "function token0() view returns (address)",
        "function token1() view returns (address)",
      ],
      args.provider
    );

    const [tokenA, tokenB] = await Promise.all([await pool.token0(), await pool.token1()]);

    const factoryAddress = UniswapV2_Factory.find((f) => f.chainId === args.chainId)?.address;
    if (!factoryAddress) throw new Error(`Factory address for chainId ${args.chainId} not found`);

    const [totalSupply, reserves] = await Promise.all([pool.totalSupply(), pool.getReserves()]);

    // Calculate what is the ratio of amount/totalSupply
    const ratio = (BigInt(input.amount) * BigInt(1e18)) / BigInt(totalSupply);

    // Get token A and token B amounts
    const amountA = (BigInt(reserves.reserve0) * ratio) / BigInt(1e18);
    const amountB = (BigInt(reserves.reserve1) * ratio) / BigInt(1e18);

    const amountAMin = (BigInt(amountA) * BigInt(10000 - +args.input.slippage)) / BigInt(10000);
    const amountBMin = (BigInt(amountB) * BigInt(10000 - +args.input.slippage)) / BigInt(10000);

    return new UniswapV2.removeLiquidity({
      chainId: args.chainId,
      input: {
        deadline: (Math.floor(Date.now() / 1000) + 60 * 20).toString(),
        liquidity: input.amount,
        to: input.recipient,
        tokenA,
        tokenB,
        amountAMin: amountAMin.toString(),
        amountBMin: amountBMin.toString(),
      },
    });
  },
  requiredActions(args) {
    // Approve Uniswap V2 router to spend LP tokens
    const UniswapV2Router = UniswapV2_Router.find((f) => f.chainId === args.chainId)?.address;
    if (!UniswapV2Router) throw new Error(`UniswapV2Router address for chainId ${args.chainId} not found`);
    return [
      {
        to: args.input.poolAddress,
        from: args.vaultAddress,
        params: { spender: UniswapV2Router, amount: args.input.amount },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
