import { SupportedContract } from "../../types";

export const UniswapV2_Router: readonly SupportedContract[] = [
  {
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    chainId: "1",
  },
  {
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    chainId: "5",
  },
] as const;

export const UniswapV2_Factory: readonly SupportedContract[] = [
  {
    address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    chainId: "1",
  },
  {
    address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    chainId: "5",
  },
] as const;
