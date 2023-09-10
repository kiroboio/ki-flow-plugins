import { createProtocolPluginsAsObject } from "../../Plugin";
import { ChainlinkOracleABI } from "./ABI";
import { ChainlinkOracleAddresses } from "./constants";

const Oracle = createProtocolPluginsAsObject({
  abi: ChainlinkOracleABI,
  supportedContracts: ChainlinkOracleAddresses,
});

export const Chainlink = { ...Oracle };
