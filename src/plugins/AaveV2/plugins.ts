import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { AaveV2_LendingPoolABI, AaveV2_ProtocolDataProviderABI } from "./ABI";
import { AaveV2_LendingPool_Addresses, AaveV2_ProtocolDataProvider_Addresses } from "./constants";

const LendingPool = createProtocolPluginsAsObject({
  protocol: "AaveV2",
  abi: AaveV2_LendingPoolABI,
  supportedContracts: AaveV2_LendingPool_Addresses,
});
const ProtocolDataProvider = createProtocolPluginsAsObject({
  protocol: "AaveV2",
  abi: AaveV2_ProtocolDataProviderABI,
  supportedContracts: AaveV2_ProtocolDataProvider_Addresses,
} as const);

export const AaveV2 = { ...LendingPool, ...ProtocolDataProvider };

export type AaveV2 = typeof AaveV2;
export type AaveV2Array = ProtocolPlugins<AaveV2>;
