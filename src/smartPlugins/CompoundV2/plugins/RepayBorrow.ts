import { isEqualAddress, isNative } from "../../../helpers";
import { InstanceOf } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { CompoundV2_cERC20, CompoundV2_cETH } from "../../../plugins";
import { cETHAddresses, cTokens } from "../../../plugins/CompoundV2/constants";

const abiFragment = {
  name: "RepayBorrow",
  inputs: [
    {
      name: "asset",
      type: "address",
      canBeVariable: false,
    },
    {
      name: "amount",
      type: "uint256",
    },
    {
      name: "behalfOf",
      type: "address",
      canBeVariable: false,
    },
  ],
} as const;

export const RepayBorrow = createSmartPlugin({
  supportedPlugins: [
    CompoundV2_cETH.repayBorrow,
    CompoundV2_cETH.repayBorrowBehalf,
    CompoundV2_cERC20.repayBorrow,
    CompoundV2_cERC20.repayBorrowBehalf,
  ],
  abiFragment,
  async prepare(args) {
    const { asset, amount, behalfOf } = args.input;

    if (isNative(asset)) {
      const cETHAddress = cETHAddresses.find((address) => address.chainId === args.chainId);
      if (!cETHAddress) throw new Error(`cETH address not found for chainId ${args.chainId}`);
      // Repays own debt
      if (isEqualAddress(behalfOf, args.vaultAddress)) {
        const plugin = new CompoundV2_cETH.repayBorrow({
          chainId: args.chainId,
          contractAddress: cETHAddress.address,
        });
        plugin.setValue(amount);
        return plugin;
      }
      const plugin = new CompoundV2_cETH.repayBorrowBehalf({
        chainId: args.chainId,
        contractAddress: cETHAddress.address,
        input: {
          borrower: behalfOf,
        },
      });
      plugin.setValue(amount);
      return plugin;
    }
    const cERC20Address = cTokens.find((token) => isEqualAddress(token.assetAddress, asset));
    if (!cERC20Address) throw new Error(`cERC20 address not found for asset ${asset}`);
    if (isEqualAddress(behalfOf, args.vaultAddress)) {
      return new CompoundV2_cERC20.repayBorrow({
        chainId: args.chainId,
        contractAddress: cERC20Address.address,
        input: {
          repayAmount: amount,
        },
      });
    }

    return new CompoundV2_cERC20.repayBorrowBehalf({
      chainId: args.chainId,
      contractAddress: cERC20Address.address,
      input: {
        borrower: behalfOf,
        repayAmount: amount,
      },
    });
  },
  requiredActions(args) {
    const { amount, asset } = args.input;

    if (InstanceOf.Variable(amount)) return [];

    // If the asset is native, return []
    if (isNative(asset)) {
      return [];
    }

    // If the asset is not native, return the required approvals
    // Find cERC20 address for this asset
    const cERC20Address = cTokens.find((token) => isEqualAddress(token.assetAddress, asset));
    if (!cERC20Address) throw new Error(`cERC20 address not found for asset ${asset}`);
    return [
      {
        to: cERC20Address.assetAddress,
        from: args.vaultAddress,
        params: { spender: cERC20Address.address, amount },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
  requiredActionsFromPlugin(args) {
    // If plugin is payable, return []
    if (args.plugin.functionType === "payable") return [];

    const { repayAmount } = args.plugin.get();

    const asset = args.plugin.contractAddress;

    if (!asset || !repayAmount || InstanceOf.Variable(repayAmount) || InstanceOf.Variable(asset)) return [];

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
