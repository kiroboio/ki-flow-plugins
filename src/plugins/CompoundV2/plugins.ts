import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { cERC20_ABI, cETH_ABI } from "./ABI";
import { cETHAddresses, cTokens } from "./constants";

// TODO: cToken mint and redeem should be a smart plugin, because they share the same method name with different parameters

export const CompoundV2_cETH = createProtocolPluginsAsObject({
  protocol: "CompoundV2_cETH",
  abi: cETH_ABI,
  supportedContracts: cETHAddresses,
});

export const CompoundV2_cERC20 = createProtocolPluginsAsObject({
  protocol: "CompoundV2_cERC20",
  abi: cERC20_ABI,
  supportedContracts: cTokens,
});

export const CompoundV2 = { ...CompoundV2_cERC20 };

export type ICompoundV2 = typeof CompoundV2;
export type CompoundV2Array = ProtocolPlugins<ICompoundV2>;
