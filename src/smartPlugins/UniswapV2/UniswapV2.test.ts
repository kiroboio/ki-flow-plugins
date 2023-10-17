import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { UniswapV2 } from "../../plugins";
import { Swap } from "./plugins";

dotenv.config();

// Mainnet addresses
const USDC = { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: "6" };
const WETH = { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: "18" };
const ETH = { address: ethers.constants.AddressZero, decimals: "18" };

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_MAINNET as string);

describe("UniswapV2 Smart Plugin tests", () => {
  describe("UniswapV2 Swap", () => {
    let smartPlugin: InstanceType<typeof Swap>;
    before(() => {
      smartPlugin = new Swap({
        chainId: "1",
        provider,
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create swapExactTokensForTokens", async () => {
      smartPlugin.set({
        fromToken: USDC,
        toToken: WETH,
        amount: "1600" + "0".repeat(6),
        isAmountIn: true,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(UniswapV2.swapExactTokensForTokens);
    });
    it("Should create swapTokensForExactTokens", async () => {
      smartPlugin.set({
        fromToken: USDC,
        toToken: WETH,
        amount: "1" + "0".repeat(18),
        isAmountIn: false,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(UniswapV2.swapTokensForExactTokens);
    });
    it("Should create swapExactETHForTokens", async () => {
      smartPlugin.set({
        fromToken: ETH,
        toToken: USDC,
        amount: "1" + "0".repeat(18),
        isAmountIn: true,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(UniswapV2.swapExactETHForTokens);
    });
    it("Should create swapETHForExactTokens", async () => {
      smartPlugin.set({
        fromToken: ETH,
        toToken: USDC,
        amount: "1600" + "0".repeat(6),
        isAmountIn: false,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(UniswapV2.swapETHForExactTokens);
    });
    it("Should create swapExactTokensForETH", async () => {
      smartPlugin.set({
        fromToken: USDC,
        toToken: ETH,
        amount: "1600" + "0".repeat(6),
        isAmountIn: true,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(UniswapV2.swapExactTokensForETH);
    });
    it("Should create swapTokensForExactETH", async () => {
      smartPlugin.set({
        fromToken: USDC,
        toToken: ETH,
        amount: "1" + "0".repeat(18),
        isAmountIn: false,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(UniswapV2.swapTokensForExactETH);
    });
  });
});
