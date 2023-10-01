import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { UniswapV2_Router_ABI } from "./ABI";
import { UniswapV2_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  protocol: "UniswapV2",
  abi: UniswapV2_Router_ABI,
  supportedContracts: UniswapV2_Router,
});

export const UniswapV2 = { ...Router };

export type UniswapV2 = typeof UniswapV2;
export type UniswapV2Array = ProtocolPlugins<UniswapV2>;
