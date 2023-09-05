export const WETHABI = [
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    gas: "85000",
  },
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
    gas: "90179",
  },
] as const;
