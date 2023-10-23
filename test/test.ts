import console from "console";
import { ethers } from "ethers";

import { FunctionParameter, SmartPlugins } from "../src";
import scriptData from "./scriptData";

export type ComponentMethods<C extends readonly FunctionParameter[]> = {
  [K in C[number]["name"]]: ReturnType<C[number]["getWithMethods"]>;
};

const plugin = new SmartPlugins.UniswapV3.Swap({
  chainId: "1",
  provider: new ethers.providers.JsonRpcProvider(scriptData[1].rpcUrl),
  vaultAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
});

async function main() {
  // plugin.set({
  //   fromToken: {
  //     address: scriptData[1].WBTC,
  //     decimals: "8",
  //   },
  //   toToken: {
  //     address: scriptData[1].UNI,
  //     decimals: "18",
  //   },
  //   amount: "1" + "0".repeat(8),
  //   isAmountIn: true, // isAmountIn
  //   recipient: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  //   slippage: "500",
  // });
  // plugin.inputs.
  // const data = await plugin.create();
  // console.log(JSON.stringify(data, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
