import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { CompoundV3 } from "../../plugins";
import { Supply, Withdraw } from "./plugins";

dotenv.config();

const comet = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";
const asset = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const amount = "1" + "0".repeat(6);

describe("CompoundV3 Smart Plugin tests", () => {
  describe("CompoundV3 Supply", () => {
    let smartPlugin: InstanceType<typeof Supply>;
    beforeEach(() => {
      smartPlugin = new Supply({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create supply", async () => {
      smartPlugin.set({
        amount,
        asset,
        comet,
        from: smartPlugin.vaultAddress,
        to: smartPlugin.vaultAddress,
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(CompoundV3.supply);
    });
    it("Should create supplyTo", async () => {
      smartPlugin.set({
        amount,
        asset,
        comet,
        from: smartPlugin.vaultAddress,
        to: ethers.Wallet.createRandom().address,
      });
      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(CompoundV3.supplyTo);
    });
    it("Should create supplyFrom", async () => {
      smartPlugin.set({
        amount,
        asset,
        comet,
        from: ethers.Wallet.createRandom().address,
        to: ethers.Wallet.createRandom().address,
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(CompoundV3.supplyFrom);
    });
  });
  describe("CompoundV3 Withdraw", () => {
    let smartPlugin: InstanceType<typeof Withdraw>;
    beforeEach(() => {
      smartPlugin = new Withdraw({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create withdraw", async () => {
      smartPlugin.set({
        amount,
        asset,
        comet,
        receiver: smartPlugin.vaultAddress,
        behalfOf: smartPlugin.vaultAddress,
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(CompoundV3.withdraw);
    });
    it("Should create withdrawTo", async () => {
      smartPlugin.set({
        amount,
        asset,
        comet,
        receiver: ethers.Wallet.createRandom().address,
        behalfOf: smartPlugin.vaultAddress,
      });
      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(CompoundV3.withdrawTo);
    });
    it("Should create supplyFrom", async () => {
      smartPlugin.set({
        amount,
        asset,
        comet,
        receiver: ethers.Wallet.createRandom().address,
        behalfOf: ethers.Wallet.createRandom().address,
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(CompoundV3.withdrawFrom);
    });
  });
});
