import { createProtocolPluginsAsObject } from "../../Plugin";
import { KiroboMulticallABI } from "./ABI";

// TODO: Multicall getter plugins should be smart plugins
// In that way we can calculate correct outputs for multicall
export const Multicall = createProtocolPluginsAsObject({ abi: KiroboMulticallABI });
