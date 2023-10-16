import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { CompoundV2_cERC20, CompoundV2_cETH } from "../../plugins";
import { Mint, RepayBorrow } from "./plugins";

dotenv.config();

describe("CompoundV2 Smart Plugin tests", () => {
  describe("CompoundV2 Mint", () => {
    let smartPlugin: InstanceType<typeof Mint>;
    beforeEach(() => {
      smartPlugin = new Mint({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create cERC20 mint", async () => {
      smartPlugin.set({
        amount: "1" + "0".repeat(6),
        asset: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
      });

      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(CompoundV2_cERC20.mint);
    });
    it("Should create cETH mint", async () => {
      smartPlugin.set({
        amount: "1" + "0".repeat(18),
        asset: ethers.constants.AddressZero,
      });

      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(CompoundV2_cETH.mint);
      expect(plugin.ethValue).eq("1" + "0".repeat(18));
    });
  });
  describe("CompoundV2 RepayBorrow", () => {
    let smartPlugin: InstanceType<typeof RepayBorrow>;
    beforeEach(() => {
      smartPlugin = new RepayBorrow({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    describe("cETH", () => {
      const asset = ethers.constants.AddressZero;
      const amount = "1" + "0".repeat(18);
      it("Should create repayBorrow", async () => {
        smartPlugin.set({
          amount,
          asset,
          behalfOf: smartPlugin.vaultAddress,
        });

        const plugin = await smartPlugin.getPlugin();

        expect(plugin).instanceOf(CompoundV2_cETH.repayBorrow);
        expect(plugin.ethValue).eq(amount);
      });
      it("Should create repayBorrowBehalf", async () => {
        smartPlugin.set({
          amount,
          asset,
          behalfOf: ethers.Wallet.createRandom().address,
        });

        const plugin = await smartPlugin.getPlugin();

        expect(plugin).instanceOf(CompoundV2_cETH.repayBorrowBehalf);
        expect(plugin.ethValue).eq(amount);
      });
    });
    describe("cERC20", () => {
      const asset = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
      const amount = "1" + "0".repeat(6);
      it("Should create repayBorrow", async () => {
        smartPlugin.set({
          amount,
          asset,
          behalfOf: smartPlugin.vaultAddress,
        });

        const plugin = await smartPlugin.getPlugin();

        expect(plugin).instanceOf(CompoundV2_cERC20.repayBorrow);
      });
      it("Should create repayBorrowBehalf", async () => {
        smartPlugin.set({
          amount,
          asset,
          behalfOf: ethers.Wallet.createRandom().address,
        });

        const plugin = await smartPlugin.getPlugin();

        expect(plugin).instanceOf(CompoundV2_cERC20.repayBorrowBehalf);
      });
    });
  });
});
