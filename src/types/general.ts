export type ChainId = "1" | "5" | "42161" | "421613";

export interface SupportedContract {
  address: string;
  chainId: ChainId;
  name?: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
}
