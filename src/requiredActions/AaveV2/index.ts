import { AaveV2Borrow } from "./borrow";
import { AaveV2Deposit } from "./deposit";
import { AaveV2Repay } from "./repay";

export const AaveV2RequiredActions = [AaveV2Deposit, AaveV2Borrow, AaveV2Repay];
