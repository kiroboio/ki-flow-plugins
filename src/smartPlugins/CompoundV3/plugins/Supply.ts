import { isEqualAddress } from "../../../helpers";
import { InstanceOf } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { CompoundV3 } from "../../../plugins";
import { RequiredApproval } from "../../../types";

const abiFragment = {
  name: "Supply",
  inputs: [
    {
      name: "comet",
      type: "address",
      canBeVariable: false,
    },
    {
      name: "asset",
      type: "address",
    },
    {
      name: "amount",
      type: "uint256",
    },
    {
      name: "to",
      type: "address",
      canBeVariable: false,
    },
    {
      name: "from",
      type: "address",
      canBeVariable: false,
    },
  ],
} as const;

export const Supply = createSmartPlugin({
  protocol: "CompoundV3",
  supportedPlugins: [CompoundV3.supply, CompoundV3.supplyTo, CompoundV3.supplyFrom],
  abiFragment,
  async prepare(args) {
    const { comet, asset, amount, to, from } = args.input;

    // If to and from are equal to args.vaultAddress, then we are using 'supply' to mint
    if (isEqualAddress(to, args.vaultAddress) && isEqualAddress(from, args.vaultAddress)) {
      return new CompoundV3.supply({
        chainId: args.chainId,
        contractAddress: comet,
        input: {
          amount,
          asset,
        },
      });
    }

    // If to is not equal to args.vaultAddress and from is equals args.vaultAddress, then we are using 'supplyTo' to mint
    if (!isEqualAddress(to, args.vaultAddress) && isEqualAddress(from, args.vaultAddress)) {
      return new CompoundV3.supplyTo({
        chainId: args.chainId,
        contractAddress: comet,
        input: {
          amount,
          asset,
          dst: to,
        },
      });
    }

    // Else it means that we are using 'supplyFrom' to mint
    return new CompoundV3.supplyFrom({
      chainId: args.chainId,
      contractAddress: comet,
      input: {
        amount,
        asset,
        from,
        dst: to,
      },
    });
  },
  requiredActions(args) {
    const { amount, asset, comet, from } = args.input;

    if (InstanceOf.Variable(amount)) return [];

    const approvals: RequiredApproval[] = [
      {
        to: asset,
        from: from,
        params: { spender: comet, amount },
        method: "approve",
        protocol: "ERC20",
      },
    ];

    // If from and to are not equal to args.vaultAddress, then we need to add that from address needs to allow to spend on behalf
    // This means that supplyFrom is used and allowance is needed
    if (!isEqualAddress(from, args.vaultAddress)) {
      approvals.push({
        to: comet,
        from: from,
        params: { manager: args.vaultAddress, isAllowed: true },
        method: "allow",
        protocol: "COMPOUNDV3",
      });
    }

    return approvals;
  },
});
