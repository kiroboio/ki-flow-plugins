import { createProtocolPluginsAsObject } from "../../Plugin";
import { RocketPoolABI, RocketPoolDepositABI } from "./ABI";
import { RocketPoolAddresses, RocketPoolDepositAddresses } from "./constants";

const RocketPoolDeposit = createProtocolPluginsAsObject({
  abi: RocketPoolDepositABI,
  supportedContracts: RocketPoolDepositAddresses,
});

const RocketPoolToken = createProtocolPluginsAsObject({
  abi: RocketPoolABI,
  supportedContracts: RocketPoolAddresses,
});

export const RocketPool = { ...RocketPoolDeposit, ...RocketPoolToken };
