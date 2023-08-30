import { createProtocolPluginsAsObject } from "../../createPlugin";
import { ERC721ABI } from "./ABI";

export const ERC721 = createProtocolPluginsAsObject({ abi: ERC721ABI });
