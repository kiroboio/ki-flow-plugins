import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { CompoundV2 } from "../../plugins";
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
    it("Should create", async () => {
      smartPlugin.set({
        amount: "1" + "0".repeat(6),
        asset: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
      });

      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(CompoundV2.mint);
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
    it("Should create", async () => {
      smartPlugin.set({
        amount: "1" + "0".repeat(6),
        asset: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        behalfOf: smartPlugin.vaultAddress,
      });

      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(CompoundV2.borrow);
    });
  });
});
