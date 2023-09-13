import { createProtocolPluginsAsObject } from "../../Plugin";
import { cERC20_ABI, cETH_ABI } from "./ABI";
import { cETHAddresses, cTokens } from "./constants";

// TODO: cToken mint and redeem should be a smart plugin, because they share the same method name with different parameters

export const CompoundV2_cETH = createProtocolPluginsAsObject({
  abi: cETH_ABI,
  supportedContracts: cETHAddresses,
});

export const CompoundV2_cERC20 = createProtocolPluginsAsObject({
  abi: cERC20_ABI,
  supportedContracts: cTokens,
});

export const CompoundV2 = { ...CompoundV2_cERC20 };
