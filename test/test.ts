import console from "console";
import { ethers } from "ethers";

import { FunctionParameter, SmartPlugins } from "../src";
import scriptData from "./scriptData";

const plugin = new SmartPlugins.UniswapV3.Swap({
  chainId: "1",
  provider: new ethers.providers.JsonRpcProvider(scriptData[1].rpcUrl),
  vaultAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
});

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

const multiBalance = new SmartPlugins.Multicall.SmartMultiBalance({
  chainId: "1",
  provider: new ethers.providers.JsonRpcProvider(scriptData[1].rpcUrl),
  vaultAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
});

const FPData = {
  components: [
    { name: "address", type: "address", canBeVariable: false },
    { name: "decimals", type: "uint16", canBeVariable: false },
  ],
  name: "fromToken",
  type: "tuple",
} as const;

async function main() {
  const param = new FunctionParameter(FPData);

  console.log(param);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
