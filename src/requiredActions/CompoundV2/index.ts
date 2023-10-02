import { CompoundV2_cERC20Mint } from "./cERC20Mint";
import { CompoundV2_cERC20RepayBorrow } from "./cERC20RepayBorrow";
import { CompoundV2_cERC20RepayBorrowBehalf } from "./cERC20RepayBorrowBehalf";

export const CompoundV2RequiredActions = [
  CompoundV2_cERC20Mint,
  CompoundV2_cERC20RepayBorrow,
  CompoundV2_cERC20RepayBorrowBehalf,
];
