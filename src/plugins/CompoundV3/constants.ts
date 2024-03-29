import { SupportedContract } from "../../types";

export const comets: readonly SupportedContract[] = [
  {
    chainId: "1",
    address: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
    name: "Compound USDC",
    symbol: "cUSDCv3",
    decimals: 6,
  },
  {
    chainId: "1",
    address: "0xA17581A9E3356d9A858b789D68B4d866e593aE94",
    name: "Compound WETH",
    symbol: "cWETHv3",
    decimals: 18,
  },
  {
    chainId: "5",
    address: "0x3EE77595A8459e93C2888b13aDB354017B198188",
    name: "Compound USDC",
    symbol: "cUSDCv3",
    decimals: 6,
  },
  {
    chainId: "5",
    address: "0x9A539EEc489AAA03D588212a164d0abdB5F08F5F",
    name: "Compound WETH",
    symbol: "cWETHv3",
    decimals: 18,
  },
  {
    chainId: "42161",
    address: "0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA",
    name: "Compound USDC.e",
    symbol: "cUSDCv3",
    decimals: 6,
  },
  {
    chainId: "42161",
    address: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
    name: "Compound USDC (Native)",
    symbol: "cUSDCv3",
    decimals: 6,
  },
  {
    chainId: "421613",
    address: "0x1d573274E19174260c5aCE3f2251598959d24456",
    name: "Compound USDC",
    symbol: "cUSDCv3",
    decimals: 6,
  },
] as const;

export const depositAssets: readonly SupportedContract[] = [
  {
    chainId: "1",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  {
    chainId: "1",
    address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    name: "Compound",
    symbol: "COMP",
    decimals: 18,
  },
  {
    chainId: "1",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    name: "Wrapped BTC",
    symbol: "WBTC",
    decimals: 8,
  },
  {
    chainId: "1",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    name: "Wrapped ETH",
    symbol: "WETH",
    decimals: 18,
  },
  {
    chainId: "1",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
  },
  {
    chainId: "1",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    name: "Chainlink",
    symbol: "LINK",
    decimals: 18,
  },
  {
    chainId: "5",
    address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  {
    chainId: "5",
    address: "0x3587b2F7E0E2D6166d6C14230e7Fe160252B0ba4",
    name: "Compound",
    symbol: "COMP",
    decimals: 18,
  },
  {
    chainId: "5",
    address: "0xAAD4992D949f9214458594dF92B44165Fb84dC19",
    name: "Wrapped BTC",
    symbol: "WBTC",
    decimals: 8,
  },
  {
    chainId: "5",
    address: "0x42a71137C09AE83D8d05974960fd607d40033499",
    name: "Wrapped ETH",
    symbol: "WETH",
    decimals: 18,
  },
  {
    chainId: "42161",
    address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
    name: "Arbitrum",
    symbol: "ARB",
    decimals: 18,
  },
  {
    chainId: "42161",
    address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    name: "GMX",
    symbol: "GMX",
    decimals: 18,
  },
  {
    chainId: "42161",
    address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    name: "USDC",
    symbol: "USDC.e",
    decimals: 6,
  },
  {
    chainId: "42161",
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    name: "Wrapped BTC",
    symbol: "WBTC",
    decimals: 8,
  },
  {
    chainId: "42161",
    address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
  },
] as const;
