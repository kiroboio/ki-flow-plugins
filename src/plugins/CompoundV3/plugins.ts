import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { cometABI } from "./ABI";
import { comets } from "./constants";

// TODO: cToken mint and redeem should be a smart plugin, because they share the same method name with different parameters

const comet = createProtocolPluginsAsObject({
  protocol: "CompoundV3",
  abi: cometABI,
  supportedContracts: comets,
});

export const CompoundV3 = { ...comet };

export type ICompoundV3 = typeof CompoundV3;
export type CompoundV3Array = ProtocolPlugins<ICompoundV3>;
