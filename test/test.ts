import { ethers } from "ethers";

import { UniswapV2 } from "../src/plugins";
import { Variable } from "../src/types";

const Swap = new UniswapV2.swapExactTokensForETH({
  chainId: "1",
  vaultAddress: ethers.Wallet.createRandom().address,
});

const variable: Variable = {
  type: "global",
  id: "activatorAddress",
};

async function main() {
  const data = await Swap.create();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
