import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { AaveV2_ProtocolDataProviderABI } from "../AaveV2/ABI";
import { AaveV3_PoolABI } from "./ABI";
import { AaveV3_Pool_Addresses, AaveV3_ProtocolDataProvider_Addresses } from "./constants";

const Pool = createProtocolPluginsAsObject({
  protocol: "AaveV3",
  abi: AaveV3_PoolABI,
  supportedContracts: AaveV3_Pool_Addresses,
});
const ProtocolDataProvider = createProtocolPluginsAsObject({
  protocol: "AaveV3",
  abi: AaveV2_ProtocolDataProviderABI,
  supportedContracts: AaveV3_ProtocolDataProvider_Addresses,
});

export const AaveV3 = { ...Pool, ...ProtocolDataProvider };

export type IAaveV3 = typeof AaveV3;
export type AaveV3Array = ProtocolPlugins<IAaveV3>;
