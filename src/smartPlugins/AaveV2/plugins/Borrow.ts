import { isEqualAddress } from "../../../helpers";
import { InstanceOf } from "../../../helpers/instanceOf";
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
  supportedPlugins: [AaveV2.borrow],
  abiFragment,
  async prepare(args) {
    return new AaveV2.borrow({
      chainId: args.chainId,
      input: { ...args.input, referralCode: "0" },
    });
  },
  requiredActions(args) {
    const { amount, asset, interestRateMode, onBehalfOf } = args.input;

    if (InstanceOf.Variable(asset) || InstanceOf.Variable(amount)) return [];

    // Find debt bearing token
    const token = AaveV2_aTokens.find(
      (token) => token.chainId === args.chainId && isEqualAddress(token.address, asset)
    );
    if (!token) return [];

    return [
      {
        // If interest rate mode 1, then we need to approve the stable debt token, else variable debt token
        to: interestRateMode === "1" ? token.stableDebtTokenAddress : token.variableDebtTokenAddress,
        from: onBehalfOf,
        params: { delegatee: args.vaultAddress, amount: amount },
        method: "approveDelegation",
        protocol: "AAVE",
      },
    ];
  },
  requiredActionsFromPlugin(args) {
    const input = args.plugin.get();
    const { interestRateMode, onBehalfOf, asset, amount } = input;

    // Check if any of the inputs are undefined
    if (
      !interestRateMode ||
      !onBehalfOf ||
      !asset ||
      !amount ||
      InstanceOf.Variable(asset) ||
      InstanceOf.Variable(amount)
    )
      return [];

    const token = AaveV2_aTokens.find(
      (token) => token.chainId === args.chainId && isEqualAddress(token.address, asset)
    );
    if (!token) return [];

    return [
      {
        // If interest rate mode 1, then we need to approve the stable debt token, else variable debt token
        to: interestRateMode === "1" ? token.stableDebtTokenAddress : token.variableDebtTokenAddress,
        from: onBehalfOf,
        params: { delegatee: args.vaultAddress, amount: amount },
        method: "approveDelegation",
        protocol: "AAVE",
      },
    ];
  },
});
