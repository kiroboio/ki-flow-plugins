import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { AaveV2 } from "../../plugins";
import { Borrow, Deposit } from "./plugins";

dotenv.config();

describe("AaveV2 Smart Plugin tests", () => {
  describe("AaveV2 Deposit", () => {
    it("Create", async () => {
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

      // Expect plugin to be instance of AaveV2.deposit
      expect(plugin).instanceOf(AaveV2.deposit);
    });
  });
  describe("AaveV2 Borrow", () => {
    it("Create", async () => {
      const smartPlugin = new Borrow({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });

      smartPlugin.set({
        interestRateMode: "2",
        amount: "1" + "0".repeat(6),
        asset: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        onBehalfOf: smartPlugin.vaultAddress,
      });

      const plugin = await smartPlugin.getPlugin();

      // Expect plugin to be instance of AaveV2.borrow
      expect(plugin).instanceOf(AaveV2.borrow);
    });
    it("interestRateMode should revert", async () => {
      const smartPlugin = new Borrow({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
      // Expect this function to revert with "`${this.name}: Invalid value. Expected one of ${this.options.join(", ")}`"
      expect(() => {
        smartPlugin.set({
          // @ts-ignore
          interestRateMode: "3",
          amount: "1" + "0".repeat(6),
          asset: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
          onBehalfOf: smartPlugin.vaultAddress,
        });
      })
        .to.throw(Error)
        .with.property("message", `interestRateMode: Invalid value. Expected: 1, 2`);
    });
  });
});
