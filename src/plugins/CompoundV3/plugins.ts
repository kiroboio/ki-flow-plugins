import { createProtocolPluginsAsObject } from "../../Plugin";
import { cometABI } from "./ABI";
import { comets } from "./constants";

// TODO: cToken mint and redeem should be a smart plugin, because they share the same method name with different parameters

const comet = createProtocolPluginsAsObject({
  protocol: "CompoundV3",
  abi: cometABI,
  supportedContracts: comets,
});

export const CompoundV3 = { ...comet };
