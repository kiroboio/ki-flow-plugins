import { createProtocolPluginsAsObject } from "../../Plugin";
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
