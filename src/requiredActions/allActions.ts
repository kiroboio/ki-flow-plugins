import { AaveV2RequiredActions } from "./AaveV2";
import { AaveV3RequiredActions } from "./AaveV3";
import { CompoundV2RequiredActions } from "./CompoundV2";
import { CompoundV3RequiredActions } from "./CompoundV3";
import { UniswapV2RequiredApprovals } from "./UniswapV2";
import { UniswapV3RequiredApprovals } from "./UniswapV3";

export const AllRequiredActions = [
  AaveV2RequiredActions,
  AaveV3RequiredActions,
  CompoundV2RequiredActions,
  CompoundV3RequiredActions,
  UniswapV2RequiredApprovals,
  UniswapV3RequiredApprovals,
].flat();
