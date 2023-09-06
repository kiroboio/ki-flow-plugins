import { createProtocolPluginsAsObject } from "../../Plugin";
import { cERC20_ABI } from "./ABI";
import { cTokens } from "./constants";

// TODO: cToken mint and redeem should be a smart plugin, because they share the same method name with different parameters

const cERC20 = createProtocolPluginsAsObject({
  abi: cERC20_ABI,
  supportedContracts: cTokens,
});

export const CompoundV2 = { ...cERC20 };
