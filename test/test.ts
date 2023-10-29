import console from "console";
import { ethers } from "ethers";
import process from "process";

import { UniswapV2 } from "../src";

const Swap = new UniswapV2.swapExactTokensForTokens({
  chainId: "1",
  rpcUrl: "none",
});

async function main() {
  Swap.set({
    amountIn: "123",
    amountOutMin: "223",
    deadline: "321",
    path: ["0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", ethers.Wallet.createRandom().address],
    to: ethers.Wallet.createRandom().address,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
