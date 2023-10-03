import { isVariableOrUndefined } from "../../helpers/instanceOf";
import { CompoundV3 } from "../../plugins";
import { RequiredApproval } from "../../types";
import { createRequiredActionForPlugin } from "../requiredAction";

export const CompoundV3SupplyTo = createRequiredActionForPlugin({
  plugin: CompoundV3.supplyTo,
  requiredActions(args) {
    const from = args.vaultAddress;
    const { amount, asset } = args.input;
    const approvals: RequiredApproval[] = [];
    if (isVariableOrUndefined(amount) || isVariableOrUndefined(asset) || isVariableOrUndefined(args.contractAddress))
      return [];

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
