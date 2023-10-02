import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { WETHABI } from "./ABI";
import { WETHContracts } from "./constants";

export const WETH = createProtocolPluginsAsObject({
  protocol: "WETH",
  abi: WETHABI,
  supportedContracts: WETHContracts,
});

export type IWETH = typeof WETH;
export type WETHArray = ProtocolPlugins<IWETH>;
