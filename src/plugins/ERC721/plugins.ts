import { createProtocolPluginsAsObject } from "../../Plugin";
import { ERC721ABI } from "./ABI";

export const ERC721 = createProtocolPluginsAsObject({ protocol: "ERC721", abi: ERC721ABI });
