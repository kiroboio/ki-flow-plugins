import { isEqualAddress } from "../../../helpers";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { CompoundV3 } from "../../../plugins";

const abiFragment = {
  name: "Withdraw",
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
      name: "receiver",
      type: "address",
      canBeVariable: false,
    },
    {
      name: "behalfOf",
      type: "address",
      canBeVariable: false,
    },
  ],
} as const;

export const Withdraw = createSmartPlugin({
  protocol: "CompoundV3",
  supportedPlugins: [CompoundV3.withdraw, CompoundV3.withdrawTo, CompoundV3.withdrawFrom],
  abiFragment,
  async prepare(args) {
    const { asset, amount, behalfOf, receiver, comet } = args.input;

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
});
