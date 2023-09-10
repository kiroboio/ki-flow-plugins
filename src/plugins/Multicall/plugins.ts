import { createProtocolPluginsAsObject } from "../../Plugin";
import { KiroboMulticallABI } from "./ABI";

export const Multicall = createProtocolPluginsAsObject({ abi: KiroboMulticallABI });
