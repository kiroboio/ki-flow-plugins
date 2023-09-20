import { ethers } from "ethers";

import { isEqualAddress, isNative } from "../../../helpers";
import { InstanceOf } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { UniswapV2 } from "../../../plugins";
import { UniswapV2_Factory } from "../../../plugins/UniswapV2/constants";
import { WETHContracts } from "../../../plugins/WETH/constants";
import { RequiredApproval } from "../../../types";

// TODO: Question is - should it be tokenA and tokenB or the LP pool? I am leaning towards tokenA and tokenB

const abiFragment = {
  name: "AddLiquidity",
  inputs: [
    {
      components: [
        { name: "address", type: "address", canBeVariable: false },
        { name: "decimals", type: "address", canBeVariable: false },
      ],
      name: "tokenA",
      type: "tuple",
    },
    {
      components: [
        { name: "address", type: "address", canBeVariable: false },
        { name: "decimals", type: "address", canBeVariable: false },
      ],
      name: "tokenB",
      type: "tuple",
    },
    {
      name: "amount",
      type: "uint256",
      canBeVariable: false,
    },
    {
      name: "isAmountTokenA",
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

export const AddLiquidity = createSmartPlugin({
  supportedPlugins: [UniswapV2.addLiquidity, UniswapV2.addLiquidityETH],
  abiFragment,
  async prepare(args) {
    /*
     * 1. Get pool from tokenA and tokenB
     * 2. Get reserves from pool
     * 3. If the amount is tokenA, calculate how much tokenB is needed
     * 4. If the amount is tokenB, calculate how much tokenA is needed
     */
    let isETH;
    if (isNative(args.input.tokenA.address)) {
      isETH = true;
      const WETH = WETHContracts.find((w) => w.chainId === args.chainId)?.address;
      if (!WETH) throw new Error(`WETH address for chainId ${args.chainId} not found`);
      args.input.tokenA.address = WETH;
    } else if (isNative(args.input.tokenB.address)) {
      isETH = true;
      const WETH = WETHContracts.find((w) => w.chainId === args.chainId)?.address;
      if (!WETH) throw new Error(`WETH address for chainId ${args.chainId} not found`);
      args.input.tokenB.address = WETH;
    }

    const [tokenA, tokenB] =
      args.input.tokenA.address.toLowerCase() < args.input.tokenB.address.toLowerCase()
        ? [args.input.tokenA, args.input.tokenB]
        : [args.input.tokenB, args.input.tokenA];

    const factoryAddress = UniswapV2_Factory.find((f) => f.chainId === args.chainId)?.address;
    if (!factoryAddress) throw new Error(`Factory address for chainId ${args.chainId} not found`);

    const factory = new ethers.Contract(
      factoryAddress,
      ["function getPair(address, address) external view returns (address)"],
      args.provider
    );
    const pair = await factory.getPair(tokenA.address, tokenB.address);

    const pairContract = new ethers.Contract(
      pair,
      ["function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"],
      args.provider
    );

    const reserves = await pairContract.getReserves();

    const amountA = args.input.isAmountTokenA
      ? args.input.amount
      : (BigInt(args.input.amount) * BigInt(reserves.reserve1)) / BigInt(reserves.reserve0);
    const amountB = args.input.isAmountTokenA
      ? (BigInt(args.input.amount) * BigInt(reserves.reserve0)) / BigInt(reserves.reserve1)
      : args.input.amount;

    const amountAMin = (BigInt(amountA) * BigInt(10000 - +args.input.slippage)) / BigInt(10000);
    const amountBMin = (BigInt(amountB) * BigInt(10000 - +args.input.slippage)) / BigInt(10000);

    if (isETH) {
      const WETH = WETHContracts.find((w) => w.chainId === args.chainId)?.address;
      if (!WETH) throw new Error(`WETH address for chainId ${args.chainId} not found`);
      const [ETHAmount, ETHAmountMin] = isEqualAddress(tokenA.address, WETH)
        ? [amountA, amountAMin]
        : [amountB, amountBMin];
      const [token, amount, amountMin] = isEqualAddress(tokenA.address, WETH)
        ? [tokenB, amountB, amountBMin]
        : [tokenA, amountA, amountAMin];

      const plugin = new UniswapV2.addLiquidityETH({
        chainId: args.chainId,
        input: {
          token: token.address,
          amountTokenDesired: amount.toString(),
          amountTokenMin: amountMin.toString(),
          amountETHMin: ETHAmountMin.toString(),
          deadline: (Math.floor(Date.now() / 1000) + 60 * 20).toString(),
          to: args.input.recipient,
        },
      });

      plugin.setValue(ETHAmount.toString());

      return plugin;
    }

    return new UniswapV2.addLiquidity({
      chainId: args.chainId,
      input: {
        tokenA: tokenA.address,
        tokenB: tokenB.address,
        amountADesired: amountA.toString(),
        amountBDesired: amountB.toString(),
        amountAMin: amountAMin.toString(),
        amountBMin: amountBMin.toString(),
        deadline: (Math.floor(Date.now() / 1000) + 60 * 20).toString(),
        to: args.input.recipient,
      },
    });
  },
  // TODO: requiredActions
  requiredActionsFromPlugin(args) {
    const Plugin = args.plugin;
    // Check if the plugins is addLiquidityETH
    if (Plugin.method === "addLiquidityETH") {
      const data = Plugin.inputs.get();
      if (!data.amountTokenDesired || InstanceOf.Variable(data.amountTokenDesired)) return [];
      const approvals: RequiredApproval[] = [
        {
          to: data.token,
          from: args.vaultAddress,
          params: { spender: args.vaultAddress, amount: data.amountTokenDesired },
          method: "approve",
          protocol: "ERC20",
        },
      ];
      return approvals;
    }
    const data = Plugin.inputs.get();
    const approvals: RequiredApproval[] = [];
    if (data.amountADesired && !InstanceOf.Variable(data.amountADesired)) {
      approvals.push({
        to: data.tokenA,
        from: args.vaultAddress,
        params: { spender: args.vaultAddress, amount: data.amountADesired },
        method: "approve",
        protocol: "ERC20",
      });
    }
    if (data.amountBDesired && !InstanceOf.Variable(data.amountBDesired)) {
      approvals.push({
        to: data.tokenB,
        from: args.vaultAddress,
        params: { spender: args.vaultAddress, amount: data.amountBDesired },
        method: "approve",
        protocol: "ERC20",
      });
    }
    return approvals;
  },
});
