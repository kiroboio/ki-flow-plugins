import { createProtocolPluginsAsObject } from "../../Plugin";
import { Sushiswap_Router_ABI } from "./ABI";
import { Sushiswap_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  abi: Sushiswap_Router_ABI,
  supportedContracts: Sushiswap_Router,
});

export const Sushiswap = { ...Router };
