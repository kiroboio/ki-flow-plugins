import { isEqualAddress } from "../../../helpers";
import { isVariableOrUndefined } from "../../../helpers/instanceOf";
import { createPluginWithRequiredActions } from "../../../Plugin/pluginWithRequiredActions";
import { CompoundV2_cERC20 } from "../../../plugins/CompoundV2";
import { cTokens } from "../../../plugins/CompoundV2/constants";

export const cERC20Mint = createPluginWithRequiredActions({
  plugin: CompoundV2_cERC20.mint,
  requiredActions(args) {
    // Else we have ERC20 plugin
    const { mintAmount } = args.input;
    const cERC20Address = args.contractAddress;

    if (isVariableOrUndefined(mintAmount) || isVariableOrUndefined(cERC20Address)) return [];

    const to = cTokens.find((token) => isEqualAddress(token.address, cERC20Address))?.assetAddress;

    if (!to) return [];

    return [
      {
        to,
        from: args.vaultAddress,
        params: { spender: cERC20Address, amount: mintAmount },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
