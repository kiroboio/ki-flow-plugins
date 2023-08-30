import { createProtocolPluginsAsObject } from "../../createPlugin";
import { ERC20ABI } from "./ABI";

export const ERC20 = createProtocolPluginsAsObject({ abi: ERC20ABI });
