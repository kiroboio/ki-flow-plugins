import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { AaveV3 } from "../../../plugins";
import { AaveV3_aTokens } from "../../../plugins/AaveV3/constants";

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
    return new AaveV3.borrow({
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
    const token = AaveV3_aTokens.find(
      (token) => token.chainId === args.chainId && token.address.toLowerCase() === asset.toLowerCase()
    );
    if (!token) return [];

    return [
      {
        to: interestRateMode === "1" ? token.stableDebtTokenAddress : token.variableDebtTokenAddress,
        from: onBehalfOf,
        params: { delegatee: args.vaultAddress, amount },
        method: "approveDelegation",
        protocol: "AAVE",
      },
    ];
  },
});
