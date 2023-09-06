import { createProtocolPluginsAsObject } from "../../Plugin";
import { AaveV2_ProtocolDataProviderABI } from "../AaveV2/ABI";
import { AaveV3_PoolABI } from "./ABI";
import { AaveV3_Pool_Addresses, AaveV3_ProtocolDataProvider_Addresses } from "./constants";

const Pool = createProtocolPluginsAsObject({
  abi: AaveV3_PoolABI,
  supportedContracts: AaveV3_Pool_Addresses,
});
const ProtocolDataProvider = createProtocolPluginsAsObject({
  abi: AaveV2_ProtocolDataProviderABI,
  supportedContracts: AaveV3_ProtocolDataProvider_Addresses,
});

export const AaveV3 = { ...Pool, ...ProtocolDataProvider };
