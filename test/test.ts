import console from "console";
import process from "process";

import { createInput } from "../src";

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

// const multiBalance = new SmartPlugins.Multicall.SmartMultiBalance({
//   chainId: "1",
//   provider: new ethers.providers.JsonRpcProvider(scriptData[1].rpcUrl),
//   vaultAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
// });

const FPData = {
  components: [
    { name: "address", type: "address", canBeVariable: false },
    { name: "decimals", type: "uint16", canBeVariable: false },
  ],
  name: "fromToken",
  type: "tuple",
} as const;

async function main() {
  const data = [
    {
      name: "to",
      type: "address",
    },
    {
      name: "value",
      type: "uint256",
    },
    {
      name: "isSomething",
      type: "bool",
    },
    {
      name: "fromToken",
      type: "tuple",
      components: [
        { name: "address", type: "address", canBeVariable: false },
        { name: "decimals", type: "uint16", canBeVariable: false },
      ],
    },
    {
      name: "list",
      type: "uint256[]",
    },
  ] as const;

  const input = createInput(data);

  input.set({
    to: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    value: "12",
    isSomething: true,
    fromToken: {
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      decimals: "18",
    },
    list: ["1", "2", "3"],
  });

  console.log(input.get());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
