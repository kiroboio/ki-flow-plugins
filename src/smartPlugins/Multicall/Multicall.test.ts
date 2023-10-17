import { expect } from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { Multicall } from "../../plugins";
import { SmartMultiAllowance, SmartMultiBalance } from "./plugins";

dotenv.config();

describe("Multicall Smart Plugin tests", () => {
  describe("Multicall SmartMultiBalance", () => {
    let smartPlugin: InstanceType<typeof SmartMultiBalance>;
    const balances = [
      {
        account: ethers.Wallet.createRandom().address,
        token: ethers.Wallet.createRandom().address,
      },
      {
        account: ethers.Wallet.createRandom().address,
        token: ethers.Wallet.createRandom().address,
      },
    ];
    beforeEach(() => {
      smartPlugin = new SmartMultiBalance({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create multiBalance", async () => {
      smartPlugin.set({
        balances,
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(Multicall.multiBalance);
    });
    it("Should create correct outputs", async () => {
      smartPlugin.set({
        balances,
      });
      const outputs = smartPlugin.outputs;

      expect(outputs).to.have.property("balance_0");
      expect(outputs).to.have.property("balance_1");

      expect(outputs.balance_0.getOutputVariable("nodeId")).to.deep.equal({
        type: "output",
        id: { innerIndex: 2, nodeId: "nodeId" },
      });
      expect(outputs.balance_1.getOutputVariable("nodeId")).to.deep.equal({
        type: "output",
        id: { innerIndex: 3, nodeId: "nodeId" },
      });
    });
  });
  describe("Multicall SmartMultiAllowance", () => {
    let smartPlugin: InstanceType<typeof SmartMultiAllowance>;
    const allowances = [
      {
        token: ethers.Wallet.createRandom().address,
        owner: ethers.Wallet.createRandom().address,
        spender: ethers.Wallet.createRandom().address,
      },
      {
        token: ethers.Wallet.createRandom().address,
        owner: ethers.Wallet.createRandom().address,
        spender: ethers.Wallet.createRandom().address,
      },
    ];
    beforeEach(() => {
      smartPlugin = new SmartMultiAllowance({
        chainId: "1",
        provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
        vaultAddress: ethers.Wallet.createRandom().address,
      });
    });
    it("Should create multiAllowance", async () => {
      smartPlugin.set({
        allowances,
      });
      const plugin = await smartPlugin.getPlugin();
      expect(plugin).instanceOf(Multicall.multiAllowance);
    });
    it("Should create correct outputs", async () => {
      smartPlugin.set({
        allowances,
      });
      const outputs = smartPlugin.outputs;

      expect(outputs).to.have.property("allowance_0");
      expect(outputs).to.have.property("allowance_1");

      expect(outputs.allowance_0.getOutputVariable("nodeId")).to.deep.equal({
        type: "output",
        id: { innerIndex: 2, nodeId: "nodeId" },
      });
      expect(outputs.allowance_1.getOutputVariable("nodeId")).to.deep.equal({
        type: "output",
        id: { innerIndex: 3, nodeId: "nodeId" },
      });
    });
  });
});
