import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { KiroboMulticallABI } from "./ABI";

// TODO: Multicall getter plugins should be smart plugins
// In that way we can calculate correct outputs for multicall
export const Multicall = createProtocolPluginsAsObject({ protocol: "KiroboMulticall", abi: KiroboMulticallABI });

export type Multicall = typeof Multicall;
export type MulticallArray = ProtocolPlugins<Multicall>;
