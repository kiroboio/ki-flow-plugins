import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { ERC721ABI } from "./ABI";

export const ERC721 = createProtocolPluginsAsObject({ protocol: "ERC721", abi: ERC721ABI });

export type IERC721 = typeof ERC721;
export type ERC721Array = ProtocolPlugins<IERC721>;
