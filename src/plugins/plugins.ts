import { OneInchArray } from "./1inch";
import { AaveV2Array } from "./AaveV2";
import { AaveV3Array } from "./AaveV3";
import { ChainlinkArray } from "./Chainlink";
import { CompoundV2Array } from "./CompoundV2";
import { CompoundV3Array } from "./CompoundV3";
import { ERC20Array } from "./ERC20";
import { ERC721Array } from "./ERC721";
import { LidoArray } from "./Lido";
import { MulticallArray } from "./Multicall";
import { RocketPoolArray } from "./RocketPool";
import { SushiswapArray } from "./Sushiswap";
import { UniswapV2Array } from "./UniswapV2";
import { UniswapV3Array } from "./UniswapV3";
import { WETHArray } from "./WETH";

export * from "./1inch";
export * from "./AaveV2";
export * from "./AaveV3";
export * from "./Chainlink";
export * from "./CompoundV2";
export * from "./CompoundV3";
export * from "./ERC20";
export * from "./ERC721";
export * from "./Lido";
export * from "./Multicall";
export * from "./RocketPool";
export * from "./Sushiswap";
export * from "./UniswapV2";
export * from "./UniswapV3";
export * from "./WETH";

export type AllPlugins = AaveV2Array &
  AaveV3Array &
  ChainlinkArray &
  CompoundV2Array &
  CompoundV3Array &
  ERC20Array &
  ERC721Array &
  LidoArray &
  MulticallArray &
  RocketPoolArray &
  SushiswapArray &
  UniswapV2Array &
  UniswapV3Array &
  WETHArray &
  OneInchArray;
