import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { NonfungiblePositionManager_ABI, UniswapV3_Router_ABI } from "./ABI";
import { UniswapV3_NonfungiblePositionManager, UniswapV3_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  protocol: "UniswapV3_Router",
  abi: UniswapV3_Router_ABI,
  supportedContracts: UniswapV3_Router,
});

const NonfungiblePositionManager = createProtocolPluginsAsObject({
  protocol: "UniswapV3_NonfungiblePositionManager",
  abi: NonfungiblePositionManager_ABI,
  supportedContracts: UniswapV3_NonfungiblePositionManager,
});

export const UniswapV3 = { ...Router, ...NonfungiblePositionManager };

export type IUniswapV3 = typeof UniswapV3;
export type UniswapV3Array = ProtocolPlugins<IUniswapV3>;
