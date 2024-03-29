import { Variable } from "./coreLib";

export type ChainId = "1" | "5" | "42161" | "421613";

export interface SupportedContract {
  address: string;
  chainId: ChainId;
  name?: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
  category?: string; // For example, Chainlink Oracle type
}

export type RequiredApproval = (
  | {
      method: "approve";
      protocol: "ERC20";
      params: {
        spender: string;
        amount: string;
      };
    }
  | {
      method: "approve";
      protocol: "ERC721";
      params: {
        to: string;
        tokenId: string;
      };
    }
  | {
      method: "setApprovalForAll";
      protocol: "ERC721";
      params: {
        operator: string;
        approved: boolean;
      };
    }
  | {
      method: "setApprovalForAll";
      protocol: "ERC1155";
      params: {
        operator: string;
        approved: boolean;
      };
    }
  | {
      method: "approveDelegation";
      protocol: "AAVE" | "RADIANTV2";
      params: {
        delegatee: string;
        amount: string;
      };
    }
  | {
      method: "allow";
      protocol: "COMPOUNDV3";
      params: {
        manager: string;
        isAllowed: boolean;
      };
    }
) & {
  to?: string | Variable;
  from?: string | Variable;
};

// Create a type that takes an object and makes every value mandatory. If the value is an object then recursively go through the object and make every value mandatory. If the value is an array then recursively go through the array and make every value mandatory.
export type RequiredObject<T extends object> = {
  [K in keyof T]-?: T[K] extends object ? RequiredObject<T[K]> : Exclude<T[K], undefined>;
};
