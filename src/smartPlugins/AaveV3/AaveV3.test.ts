import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { AaveV3 } from "../../plugins";
import { Borrow, Deposit, Repay } from "./plugins";

dotenv.config();

describe("AaveV3 Smart Plugin tests", () => {
  describe("AaveV3 Deposit", () => {
    it("Should create", async () => {
      const smartPlugin = new Deposit({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });

      smartPlugin.set({
        amount: "1" + "0".repeat(6),
        asset: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        onBehalfOf: smartPlugin.vaultAddress,
      });

      const plugin = await smartPlugin.getPlugin();

      // Expect plugin to be instance of AaveV3.deposit
      expect(plugin).instanceOf(AaveV3.deposit);
    });
  });
  describe("AaveV3 Borrow", () => {
    let smartPlugin: InstanceType<typeof Borrow>;
    beforeEach(() => {
      smartPlugin = new Borrow({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create", async () => {
      smartPlugin.set({
        interestRateMode: "2",
        amount: "1" + "0".repeat(6),
        asset: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        onBehalfOf: smartPlugin.vaultAddress,
      });

      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(AaveV3.borrow);
    });
  });
  describe("AaveV3 Repay", () => {
    // smartPlugin is an initialized instance of AaveV3 Repay
    let smartPlugin: InstanceType<typeof Repay>;

    beforeEach(() => {
      smartPlugin = new Repay({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create", async () => {
      smartPlugin.set({
        amount: "1" + "0".repeat(6),
        asset: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        onBehalfOf: smartPlugin.vaultAddress,
        interestRateMode: "2",
      });

      const plugin = await smartPlugin.getPlugin();

      expect(plugin).instanceOf(AaveV3.repay);
    });
  });
});
