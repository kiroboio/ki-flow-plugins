import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { ERC20ABI } from "./ABI";

export const ERC20 = createProtocolPluginsAsObject({ protocol: "ERC20", abi: ERC20ABI });

export type ERC20 = typeof ERC20;
export type ERC20Array = ProtocolPlugins<ERC20>;
