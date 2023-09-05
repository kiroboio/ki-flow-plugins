import { createProtocolPluginsAsObject } from "../../createPlugin";
import { AaveV2_LendingPoolABI, AaveV2_ProtocolDataProviderABI } from "./ABI";
import { AaveV2_LendingPool_Addresses, AaveV2_ProtocolDataProvider_Addresses } from "./constants";

const LendingPool = createProtocolPluginsAsObject({
  abi: AaveV2_LendingPoolABI,
  supportedContracts: AaveV2_LendingPool_Addresses,
});
const ProtocolDataProvider = createProtocolPluginsAsObject({
  abi: AaveV2_ProtocolDataProviderABI,
  supportedContracts: AaveV2_ProtocolDataProvider_Addresses,
});

export const AaveV2 = { ...LendingPool, ...ProtocolDataProvider };
