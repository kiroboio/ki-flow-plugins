import { Ether, Token } from "@uniswap/sdk-core";
import { ethers } from "ethers";

export function createToken(token: { address: string; decimals: number }, chainId: number) {
  if (token.address === ethers.constants.AddressZero) {
    return Ether.onChain(chainId);
  }
  return new Token(chainId, token.address, +token.decimals);
}

// This is to remove unnecessary properties from the output type. Use it eg. `ExtractPropsFromArray<Inventory.ItemStructOutput>`
export type ExtractPropsFromArray<T> = Omit<T, keyof Array<unknown> | `${number}`>;

// convertToStruct takes an array type eg. Inventory.ItemStructOutput and converts it to an object type.
export const handleInput = <A extends Array<unknown>>(arr: A): ExtractPropsFromArray<A> => {
  const keys = Object.keys(arr).filter((key) => isNaN(Number(key)));
  const result = {};
  // @ts-ignore
  arr.forEach((item, index) => (result[keys[index]] = handleValue(item)));
  return result as A;
};

// @ts-ignore
export const handleValue = (value: any): any => {
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return value.toString();
  if (value instanceof ethers.BigNumber) return value.toString();
  if (value instanceof Array) return value.map((v) => handleValue(v));
};
