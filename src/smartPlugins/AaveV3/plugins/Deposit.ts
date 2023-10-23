import { InstanceOf } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { AaveV3 } from "../../../plugins";
import { AaveV3_Pool_Addresses } from "../../../plugins/AaveV3/constants";

const abiFragment = {
  name: "Deposit",
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
      name: "onBehalfOf",
      type: "address",
    },
  ],
} as const;

export const Deposit = createSmartPlugin({
  protocol: "AaveV3",
  supportedPlugins: [AaveV3.deposit],
  abiFragment,
  async prepare(args) {
    return new AaveV3.deposit({
      chainId: args.chainId,
      input: { ...args.input, referralCode: "0" },
    });
  },
  requiredActions(args) {
    const { amount, asset: to } = args.input;
    if (InstanceOf.Variable(amount)) return [];

    const spender = AaveV3_Pool_Addresses.find((address) => address.chainId === args.chainId);
    if (!spender) throw new Error("No Aave V3 address found for this chainId");
    return [
      {
        to,
        from: args.vaultAddress,
        params: { spender: spender.address, amount },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
