import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { UniswapV3_Router_ABI } from "./ABI";
import { UniswapV3_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  protocol: "UniswapV3",
  abi: UniswapV3_Router_ABI,
  supportedContracts: UniswapV3_Router,
});

export const UniswapV3 = { ...Router };

export type UniswapV3 = typeof UniswapV3;
export type UniswapV3Array = ProtocolPlugins<UniswapV3>;
