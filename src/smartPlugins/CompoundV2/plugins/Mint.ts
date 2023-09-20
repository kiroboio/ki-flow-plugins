import { isEqualAddress, isNative } from "../../../helpers";
import { InstanceOf } from "../../../helpers/instanceOf";
import { createSmartPlugin } from "../../../Plugin/smartPlugin";
import { CompoundV2_cERC20, CompoundV2_cETH } from "../../../plugins";
import { cETHAddresses, cTokens } from "../../../plugins/CompoundV2/constants";

const abiFragment = {
  name: "Mint",
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
  ],
} as const;

export const Mint = createSmartPlugin({
  supportedPlugins: [CompoundV2_cETH.mint, CompoundV2_cERC20.mint],
  abiFragment,
  async prepare(args) {
    const { asset, amount } = args.input;

    if (isNative(asset)) {
      const plugin = new CompoundV2_cETH.mint({
        chainId: args.chainId,
      });
      plugin.setValue(amount);
      // Find the cETH token address for this chainId
      const cETHAddress = cETHAddresses.find((address) => address.chainId === args.chainId);
      if (!cETHAddress) throw new Error(`cETH address not found for chainId ${args.chainId}`);
      plugin.setContractAddress(cETHAddress.address);
      return plugin;
    }

    const cERC20Address = cTokens.find((token) => isEqualAddress(token.assetAddress, asset));
    if (!cERC20Address) throw new Error(`cERC20 address not found for asset ${asset}`);

    const plugin = new CompoundV2_cERC20.mint({
      chainId: args.chainId,
      input: {
        mintAmount: amount,
      },
    });
    plugin.setContractAddress(cERC20Address.address);
    return plugin;
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
        to: cERC20Address?.assetAddress,
        from: args.vaultAddress,
        params: { spender: cERC20Address.address, amount },
        method: "approve",
        protocol: "ERC20",
      },
    ];
  },
});
