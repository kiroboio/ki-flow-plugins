import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { UniswapV3 } from "../../plugins";
import { createRequiredActionForPlugin } from "../requiredAction";

export const UniswapV3ExactOutput = createRequiredActionForPlugin({
  plugin: UniswapV3.exactOutput,
  requiredActions(args) {
    const from = args.vaultAddress;
    const {
      params: { amountInMaximum, path },
    } = args.input;

    if (
      isVariableOrUndefined(amountInMaximum) ||
      isVariableOrUndefined(args.contractAddress) ||
      isVariableOrUndefined(path)
    )
      return [];

    // Path is UniswapV3 path as bytes. It encodePacked like this - token0+fee+token1+fee+token2+fee+...
    // Example of token0+fee+token1+fee+token2: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4dac17f958d2ee523a2206206994597c13d831ec7000bb895ad61b0a150d79219dcf64e1e6cc01f0b64c4ce
    // Get token0

    const encodedAddress = path.slice(0, 42);

    return [
      {
        to: encodedAddress,
        from,
        params: { spender: args.contractAddress, amount: amountInMaximum },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
