import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { AaveV2 } from "../../../plugins";
import { AaveV2_aTokens } from "../../../plugins/AaveV2/constants";

const abiFragment = {
  name: "Borrow",
  inputs: [
    {
      name: "asset",
      type: "address",
    },
    {
      name: "amount",
      type: "uint256",
    },
    {
      name: "interestRateMode",
      type: "uint256",
    },
    {
      name: "onBehalfOf",
      type: "address",
    },
  ],
} as const;

export const Borrow = createSmartPlugin({
  abiFragment,
  async prepare(args) {
    return new AaveV2.borrow({
      chainId: args.chainId,
      input: { ...args.input, referralCode: "0" },
    });
  },
  requiredActions(args) {
    const { amount, asset, interestRateMode, onBehalfOf } = args.input;
    if (
      !amount ||
      !asset ||
      !interestRateMode ||
      !onBehalfOf ||
      !args.vaultAddress ||
      onBehalfOf?.toLowerCase() === args.vaultAddress
    ) {
      return [];
    }

    // Find debt bearing token
    const token = AaveV2_aTokens.find(
      (token) => token.chainId === args.chainId && token.address.toLowerCase() === asset.toLowerCase()
    );
    if (!token) return [];

    return [
      {
        to: token.address,
        from: onBehalfOf,
        params: { delegatee: args.vaultAddress, amount },
        method: "approveDelegation",
        protocol: "AAVE",
      },
    ];
  },
});
