import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { RocketPoolABI, RocketPoolDepositABI } from "./ABI";
import { RocketPoolAddresses, RocketPoolDepositAddresses } from "./constants";

const RocketPoolDeposit = createProtocolPluginsAsObject({
  protocol: "RocketPool",
  abi: RocketPoolDepositABI,
  supportedContracts: RocketPoolDepositAddresses,
});

const RocketPoolToken = createProtocolPluginsAsObject({
  protocol: "RocketPool",
  abi: RocketPoolABI,
  supportedContracts: RocketPoolAddresses,
});

export const RocketPool = { ...RocketPoolDeposit, ...RocketPoolToken };

export type RocketPool = typeof RocketPool;
export type RocketPoolArray = ProtocolPlugins<RocketPool>;
