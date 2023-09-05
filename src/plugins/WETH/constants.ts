import { SupportedContract } from "../../types";

export const WETHContracts: readonly SupportedContract[] = [
  {
    chainId: "1",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  {
    chainId: "5",
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  {
    chainId: "42161",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  {
    chainId: "421613",
    address: "0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
] as const;
