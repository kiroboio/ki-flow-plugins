import { AaveV2RequiredActions } from "./AaveV2";
import { AaveV3RequiredActions } from "./AaveV3";
import { CompoundV2RequiredActions } from "./CompoundV2";
import { CompoundV3RequiredActions } from "./CompoundV3";

export const AllRequiredActions = [
  AaveV2RequiredActions,
  AaveV3RequiredActions,
  CompoundV2RequiredActions,
  CompoundV3RequiredActions,
].flat();
