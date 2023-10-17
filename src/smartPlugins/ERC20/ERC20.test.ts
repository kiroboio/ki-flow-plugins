import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { ERC20 } from "../../plugins";
import { SmartTransfer } from "./plugins";

dotenv.config();

const asset = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const amount = "1" + "0".repeat(6);

describe("ERC20 Smart Plugin tests", () => {
  describe("ERC20 SmartTransfer", () => {
    let smartPlugin: InstanceType<typeof SmartTransfer>;
    beforeEach(() => {
      smartPlugin = new SmartTransfer({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create transfer", async () => {
      smartPlugin.set({
        asset,
        amount,
        from: smartPlugin.vaultAddress,
        to: ethers.Wallet.createRandom().address,
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(ERC20.transfer);
    });
    it("Should create transferFrom", async () => {
      smartPlugin.set({
        asset,
        amount,
        from: ethers.Wallet.createRandom().address,
        to: ethers.Wallet.createRandom().address,
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(ERC20.transferFrom);
    });
  });
});
