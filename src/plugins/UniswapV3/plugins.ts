import { createProtocolPluginsAsObject } from "../../createPlugin";
import { UniswapV3_Router_ABI } from "./ABI";
import { UniswapV3_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  abi: UniswapV3_Router_ABI,
  supportedAddressses: UniswapV3_Router,
});

export const UniswapV3 = { ...Router };
