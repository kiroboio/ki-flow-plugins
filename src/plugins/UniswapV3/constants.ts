import { SupportedContract } from "../../types";

export const UniswapV3_Router: readonly SupportedContract[] = [
  {
    address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    chainId: "1",
  },
  {
    address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    chainId: "5",
  },
  {
    address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    chainId: "42161",
  },
  {
    address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    chainId: "421613",
  },
] as const;
