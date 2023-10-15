import { expect } from "chai";
import { ethers } from "ethers";

import { AaveV2 } from "../../plugins";
import { Deposit } from "./plugins";

describe("AaveV2 Smart Plugin tests", () => {
  it("Create deposit test", async () => {
    // the single test
    const smartPlugin = new Deposit({
      chainId: "1",
      provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
      vaultAddress: "0x1234567890123456789012345678901234567890",
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
