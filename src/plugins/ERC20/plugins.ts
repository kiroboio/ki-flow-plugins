import { createProtocolPluginsAsObject } from "../../Plugin";
import { ERC20ABI } from "./ABI";

export const ERC20 = createProtocolPluginsAsObject({ abi: ERC20ABI });
