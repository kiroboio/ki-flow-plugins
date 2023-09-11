export const RocketPoolDepositABI = [
  { inputs: [], name: "deposit", outputs: [], stateMutability: "payable", type: "function" },
] as const;

export const RocketPoolABI = [
  {
    inputs: [{ internalType: "uint256", name: "_rethAmount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCollateralRate",
    outputs: [{ internalType: "uint256", name: "collateralRate", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "rethAmount", type: "uint256" }],
    name: "getEthValue",
    outputs: [{ internalType: "uint256", name: "ethValue", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getExchangeRate",
    outputs: [{ internalType: "uint256", name: "exchangeRate", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "ethAmount", type: "uint256" }],
    name: "getRethValue",
    outputs: [{ internalType: "uint256", name: "rethValue", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalCollateral",
    outputs: [{ internalType: "uint256", name: "totalCollateral", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
