import { isEqualAddress, isNative } from "../../../helpers";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { CompoundV2_cERC20, CompoundV2_cETH } from "../../../plugins";
import { cETHAddresses, cTokens } from "../../../plugins/CompoundV2/constants";

const abiFragment = {
  name: "RepayBorrow",
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
      name: "behalfOf",
      type: "address",
    },
  ],
} as const;

export const RepayBorrow = createSmartPlugin({
  abiFragment,
  async prepare(args) {
    const { asset, amount, behalfOf } = args.input;
    // If the asset is 0x0 or 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee, then we are minting ETH
    if (!asset || !amount || !behalfOf) throw new Error("Invalid input");

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
    if (!asset || !amount) throw new Error("Invalid input");

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
});
