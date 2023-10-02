import { AaveV3Borrow } from "./borrow";
import { AaveV3Deposit } from "./deposit";
import { AaveV3Repay } from "./repay";

export const AaveV3RequiredActions = [AaveV3Deposit, AaveV3Borrow, AaveV3Repay];
