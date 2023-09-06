import { createProtocolPluginsAsObject } from "../../Plugin";
import { UniswapV3_Router_ABI } from "./ABI";
import { UniswapV3_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  abi: UniswapV3_Router_ABI,
  supportedContracts: UniswapV3_Router,
});

export const UniswapV3 = { ...Router };
