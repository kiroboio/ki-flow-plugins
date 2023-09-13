import { isEqualAddress } from "../../../helpers";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { CompoundV3 } from "../../../plugins";
import { RequiredApproval } from "../../../types";

const abiFragment = {
  name: "Withdraw",
  inputs: [
    {
      name: "comet",
      type: "address",
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
      name: "receiver",
      type: "address",
    },
    {
      name: "behalfOf",
      type: "address",
    },
  ],
} as const;

export const Withdraw = createSmartPlugin({
  abiFragment,
  async prepare(args) {
    const { asset, amount, behalfOf, receiver, comet } = args.input;
    if (!asset || !amount || !behalfOf || !receiver || !comet) throw new Error("Invalid input");

    // If behalfOn === receiver === args.vaultAddress, then we are using 'withdraw' to redeem
    if (isEqualAddress(behalfOf, receiver) && isEqualAddress(receiver, args.vaultAddress)) {
      return new CompoundV3.withdraw({
        chainId: args.chainId,
        contractAddress: comet,
        input: {
          amount,
          asset,
        },
      });
    }

    // if receiver !== args.vaultAddress, but behalfOf === args.vaultAddress, then we are using 'withdrawTo' to redeem
    if (!isEqualAddress(behalfOf, receiver) && isEqualAddress(behalfOf, args.vaultAddress)) {
      return new CompoundV3.withdrawTo({
        chainId: args.chainId,
        contractAddress: comet,
        input: {
          amount,
          asset,
          to: receiver,
        },
      });
    }

    return new CompoundV3.withdrawFrom({
      chainId: args.chainId,
      contractAddress: comet,
      input: {
        amount,
        asset,
        src: behalfOf,
        to: receiver,
      },
    });
  },
  requiredActions(args) {
    const { asset, amount, behalfOf, receiver, comet } = args.input;
    if (!asset || !amount || !behalfOf || !receiver || !comet) throw new Error("Invalid input");

    const approvals: RequiredApproval[] = [
      {
        to: asset,
        from: behalfOf,
        params: { spender: comet, amount },
        method: "approve",
        protocol: "ERC20",
      },
    ];

    if (!isEqualAddress(behalfOf, args.vaultAddress)) {
      approvals.push({
        to: comet,
        from: behalfOf,
        params: { manager: args.vaultAddress, isAllowed: true },
        method: "allow",
        protocol: "COMPOUNDV3",
      });
    }

    return approvals;
  },
});
