import { isEqualAddress } from "../../helpers";
import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { CompoundV2_cERC20 } from "../../plugins";
import { cTokens } from "../../plugins/CompoundV2/constants";
import { createRequiredActionForPlugin } from "../requiredAction";

export const CompoundV2_cERC20RepayBorrowBehalf = createRequiredActionForPlugin({
  plugin: CompoundV2_cERC20.repayBorrowBehalf,
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
