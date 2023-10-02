import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { ChainlinkOracleABI } from "./ABI";
import { ChainlinkOracleAddresses } from "./constants";

const Oracle = createProtocolPluginsAsObject({
  protocol: "Chainlink",
  abi: ChainlinkOracleABI,
  supportedContracts: ChainlinkOracleAddresses,
});

export const Chainlink = { ...Oracle };

export type IChainlink = typeof Chainlink;
export type ChainlinkArray = ProtocolPlugins<IChainlink>;
