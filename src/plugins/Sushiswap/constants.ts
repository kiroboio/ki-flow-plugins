import { SupportedContract } from "../../types";

export const Sushiswap_Router: readonly SupportedContract[] = [
  {
    address: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
    chainId: "1",
  },
  {
    address: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    chainId: "5",
  },
  {
    address: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    chainId: "42161",
  },
] as const;

export const Sushi_MasterChefV2: readonly SupportedContract[] = [
  {
    address: "0xbE811A0D44E2553d25d11CB8DC0d3F0D0E6430E6",
    chainId: "1",
  },
] as const;
