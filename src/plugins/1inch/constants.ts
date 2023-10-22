import { SupportedContract } from "../../types";

export const OneInch_Router: readonly SupportedContract[] = [
  {
    address: "0x1111111254EEB25477B68fb85Ed929f73A960582",
    chainId: "1",
  },
  // TODO: Not sure if OneInch has Goerli support
  // {
  //   address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  //   chainId: "5",
  // },
] as const;
