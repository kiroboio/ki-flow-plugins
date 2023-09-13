import { SupportedContract } from "../../types";

interface CToken extends SupportedContract {
  assetAddress: string;
}

export const Comptroller: readonly SupportedContract[] = [
  {
    address: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
    chainId: "1",
  },
  {
    address: "0x05Df6C772A563FfB37fD3E04C1A279Fb30228621",
    chainId: "5",
  },
] as const;

export const cTokens: readonly CToken[] = [
  {
    chainId: "1",
    address: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
    name: "Compound USD Coin",
    symbol: "cUSDC",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_usdc.svg",
    assetAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },

  {
    chainId: "1",
    address: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    name: "Compound Dai",
    symbol: "cDAI",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_dai.svg",
    assetAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },

  {
    chainId: "1",
    address: "0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4",
    name: "Compound Collateral",
    symbol: "cCOMP",
    decimals: 8,
    assetAddress: "0xc00e94cb662c3520282e6f5717214004a7f26888",
  },
  {
    chainId: "1",
    address: "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9",
    name: "Compound USDT",
    symbol: "cUSDT",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_usdt.svg",
    assetAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    chainId: "1",
    address: "0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E",
    name: "Compound Basic Attention Token",
    symbol: "cBAT",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_bat.svg",
    assetAddress: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
  },
  {
    chainId: "1",
    address: "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC",
    name: "Compound Sai",
    symbol: "cSAI",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_sai.svg",
    assetAddress: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
  },
  {
    chainId: "1",
    address: "0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1",
    name: "Compound Augur",
    symbol: "cREP",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_rep.svg",
    assetAddress: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
  },
  {
    chainId: "1",
    address: "0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407",
    name: "Compound 0x",
    symbol: "cZRX",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_zrx.svg",
    assetAddress: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
  },
  {
    chainId: "1",
    address: "0xC11b1268C1A384e55C48c2391d8d480264A3A7F4",
    name: "Compound Wrapped BTC",
    symbol: "cWBTC",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_wbtc.svg",
    assetAddress: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  },
  {
    chainId: "1",
    address: "0xFAce851a4921ce59e912d19329929CE6da6EB0c7",
    name: "Compound ChainLink",
    symbol: "cLINK",
    decimals: 8,
    assetAddress: "0x514910771af9ca656af840dff83e8264ecf986ca",
  },
  {
    chainId: "1",
    address: "0x35A18000230DA775CAc24873d00Ff85BccdeD550",
    name: "Compound Uniswap",
    symbol: "cUNI",
    decimals: 8,
    assetAddress: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  },
  {
    chainId: "1",
    address: "0x12392F67bdf24faE0AF363c24aC620a2f67DAd86",
    name: "Compound TrueUSD",
    symbol: "cTUSD",
    decimals: 8,
    assetAddress: "0x0000000000085d4780B73119b644AE5ecd22b376",
  },
  {
    chainId: "5",
    address: "0x0fF50a12759b081Bb657ADaCf712C52bb015F1Cd",
    name: "Compound Collateral",
    symbol: "cCOMP",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_comp.svg",
    assetAddress: "0x3587b2F7E0E2D6166d6C14230e7Fe160252B0ba4",
  },
  {
    chainId: "5",
    address: "0x73506770799Eb04befb5AaE4734e58C2C624F493",
    name: "Compound USD Coin",
    symbol: "cUSDC",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_usdc.svg",
    assetAddress: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
  },
  {
    chainId: "5",
    address: "0x0545a8eaF7ff6bB6F708CbB544EA55DBc2ad7b2a",
    name: "Compound Dai",
    symbol: "cDAI",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_dai.svg",
    assetAddress: "0x2899a03ffDab5C90BADc5920b4f53B0884EB13cC",
  },
  {
    chainId: "5",
    address: "0xDa6F609F3636062E06fFB5a1701Df3c5F1ab3C8f",
    name: "Compound Wrapped BTC",
    symbol: "cWBTC",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_wbtc.svg",
    assetAddress: "0xAAD4992D949f9214458594dF92B44165Fb84dC19",
  },
  {
    chainId: "5",
    address: "0x2073d38198511F5Ed8d893AB43A03bFDEae0b1A5",
    name: "Compound Uniswap",
    symbol: "cUNI",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_uni.svg",
    assetAddress: "0x208F73527727bcB2D9ca9bA047E3979559EB08cC",
  },
] as const;

export const cETHAddresses: readonly SupportedContract[] = [
  {
    chainId: "1",
    address: "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5",
    name: "Compound Ether",
    symbol: "cETH",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_eth.svg",
  },
  {
    chainId: "5",
    address: "0x20572e4c090f15667cF7378e16FaD2eA0e2f3EfF",
    name: "Compound Ether",
    symbol: "cETH",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_eth.svg",
  },
] as const;
