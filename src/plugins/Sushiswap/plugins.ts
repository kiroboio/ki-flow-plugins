import { createProtocolPluginsAsObject } from "../../Plugin";
import { Sushiswap_MasterChefV2_ABI, Sushiswap_Router_ABI } from "./ABI";
import { Sushi_MasterChefV2, Sushiswap_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  protocol: "Sushiswap",
  abi: Sushiswap_Router_ABI,
  supportedContracts: Sushiswap_Router,
});

const MasterChefV2 = createProtocolPluginsAsObject({
  protocol: "Sushiswap",
  abi: Sushiswap_MasterChefV2_ABI,
  supportedContracts: Sushi_MasterChefV2,
});

export const Sushiswap = { ...Router, ...MasterChefV2 };
