import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { UniswapV3 } from "../../plugins";
import { Swap } from "./plugins";

dotenv.config();

// Mainnet addresses
const USDC = { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: "6" };
const WETH = { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: "18" };
const WBTC = { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: "8" };
const UNI = { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: "18" };
// const ETH = { address: ethers.constants.AddressZero, decimals: "18" };

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_MAINNET as string);

describe("UniswapV3 Smart Plugin tests", () => {
  describe("UniswapV3 Swap", () => {
    let smartPlugin: InstanceType<typeof Swap>;
    before(() => {
      smartPlugin = new Swap({
        chainId: "1",
        provider,
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create exactSingleInput", async () => {
      smartPlugin.set({
        fromToken: USDC,
        toToken: WETH,
        amount: "1600" + "0".repeat(6),
        isAmountIn: true,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(UniswapV3.exactInputSingle);
    });
    it("Should create exactInput", async () => {
      smartPlugin.set({
        fromToken: WBTC,
        toToken: UNI,
        amount: "1" + "0".repeat(8),
        isAmountIn: true,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(UniswapV3.exactInput);
    });
    it("Should create exactOutputSingle", async () => {
      smartPlugin.set({
        fromToken: USDC,
        toToken: WETH,
        amount: "1" + "0".repeat(18),
        isAmountIn: false,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(UniswapV3.exactOutputSingle);
    });
    it("Should create exactOutput", async () => {
      smartPlugin.set({
        fromToken: WBTC,
        toToken: UNI,
        amount: "10000" + "0".repeat(18),
        isAmountIn: false,
        recipient: smartPlugin.vaultAddress,
        slippage: "500",
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(UniswapV3.exactOutput);
    });
  });
});
