import { isEqualAddress } from "../../helpers";
import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { CompoundV3 } from "../../plugins";
import { RequiredApproval } from "../../types";
import { createRequiredActionForPlugin } from "../requiredAction";

export const CompoundV3SupplyFrom = createRequiredActionForPlugin({
  plugin: CompoundV3.supplyFrom,
  requiredActions(args) {
    const { amount, asset, from } = args.input;
    const approvals: RequiredApproval[] = [];
    if (
      isVariableOrUndefined(amount) ||
      isVariableOrUndefined(asset) ||
      isVariableOrUndefined(args.contractAddress) ||
      isVariableOrUndefined(from)
    )
      return [];

    // If from and to are not equal to args.vaultAddress, then we need to add that from address needs to allow to spend on behalf
    // This means that supplyFrom is used and allowance is needed
    if (!isEqualAddress(from, args.vaultAddress)) {
      approvals.push({
        to: asset,
        from: from,
        params: { manager: args.vaultAddress, isAllowed: true },
        method: "allow",
        protocol: "COMPOUNDV3",
      });
    }

    approvals.push({
      to: asset,
      from: from,
      params: { spender: args.contractAddress, amount },
      method: "approve",
      protocol: "ERC20",
    });

    return approvals;
  },
});
