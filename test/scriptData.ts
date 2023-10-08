import * as dotenv from "dotenv";

dotenv.config();

export const scriptData = {
  1: {
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    KIRO: "0xB1191F691A355b43542Bea9B8847bc73e7Abb137",
    UNI: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    WBTC: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    rpcUrl: process.env.RPC_URL_MAINNET as string,
  },
  5: {
    USDC: "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
    KIRO: "0xba232b47a7ddfccc221916cf08da03a4973d3a1d",
    rpcUrl: "https://goerli.infura.io/v3/99229ae47ba74d21abc557bdc503a5d9",
  },
  42161: {
    rpcUrl: "https://rpc.ankr.com/arbitrum",
  },
  421613: {
    rpcUrl: "https://arb-goerli.g.alchemy.com/v2/wjZQ8R9YDxyzIa9USq-lHXDUiVjWrk2y",
  },
};

export default scriptData;
