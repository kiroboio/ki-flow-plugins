import { createProtocolPluginsAsObject } from "../../createPlugin";
import { WETHABI } from "./ABI";
import { WETHContracts } from "./constants";

export const WETH = createProtocolPluginsAsObject({ abi: WETHABI, supportedContracts: WETHContracts });
