import { isEqualAddress } from "../../../helpers";
import { isVariableOrUndefined } from "../../../helpers/instanceOf";
import { createPluginWithRequiredActions } from "../../../Plugin/pluginWithRequiredActions";
import { CompoundV2_cERC20 } from "../../../plugins/CompoundV2";
import { cTokens } from "../../../plugins/CompoundV2/constants";

export const cERC20RepayBorrow = createPluginWithRequiredActions({
  plugin: CompoundV2_cERC20.repayBorrow,
  requiredActions(args) {
    const { repayAmount } = args.input;
    const asset = args.contractAddress;

    if (isVariableOrUndefined(asset) || isVariableOrUndefined(repayAmount)) return [];

    const cERC20Address = cTokens.find((token) => isEqualAddress(token.address, asset));
    if (!cERC20Address) throw new Error(`cERC20 address not found for asset ${asset}`);
    return [
      {
        to: cERC20Address.assetAddress,
        from: args.vaultAddress,
        params: { spender: asset, amount: repayAmount },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
