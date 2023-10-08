import { ethers } from "ethers";

import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { UniswapV3 } from "../../plugins";
import { NonfungiblePositionManager_ABI } from "../../plugins/UniswapV3/ABI";
import { UniswapV3_NonfungiblePositionManager } from "../../plugins/UniswapV3/constants";
import { createRequiredActionForPlugin } from "../requiredAction";

export const UniswapV3IncreaseLiquidity = createRequiredActionForPlugin({
  plugin: UniswapV3.increaseLiquidity,
  async requiredActions(args) {
    const from = args.vaultAddress;
    const {
      params: { amount0Desired, amount1Desired, tokenId },
    } = args.input;

    if (
      isVariableOrUndefined(tokenId) ||
      isVariableOrUndefined(amount0Desired) ||
      isVariableOrUndefined(amount1Desired) ||
      isVariableOrUndefined(args.contractAddress)
    )
      return [];

    const NPMAddress = UniswapV3_NonfungiblePositionManager.find((data) => data.chainId === args.chainId)?.address;

    if (!NPMAddress) return [];

    // Fetch position data
    const NonfungiblePositionManager = new ethers.Contract(NPMAddress, NonfungiblePositionManager_ABI, args.provider);
    const position = await NonfungiblePositionManager.positions(tokenId);

    return [
      {
        to: position.token0,
        from,
        params: { spender: args.contractAddress, amount: amount0Desired },
        method: "approve",
        protocol: "ERC20",
      },
      {
        to: position.token1,
        from,
        params: { spender: args.contractAddress, amount: amount1Desired },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
