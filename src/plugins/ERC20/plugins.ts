import { createProtocolPluginsAsObject } from "../../Plugin";
import { ERC20ABI } from "./ABI";

export const ERC20 = createProtocolPluginsAsObject({ protocol: "ERC20", abi: ERC20ABI });
