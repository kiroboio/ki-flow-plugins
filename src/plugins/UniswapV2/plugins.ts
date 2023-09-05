import { createProtocolPluginsAsObject } from "../../createPlugin";
import { UniswapV2_Router_ABI } from "./ABI";
import { UniswapV2_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  abi: UniswapV2_Router_ABI,
  supportedAddressses: UniswapV2_Router,
});

export const UniswapV2 = { ...Router };
