export const ERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "name",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    gas: "75750",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "isApproved",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    gas: "124834",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "totalSupply",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    gas: "74316",
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    gas: "107870",
    options: {
      falseMeansFail: true,
    },
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "decimals",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    gas: "74434",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    gas: "75448",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "symbol",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    gas: "75834",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    gas: "92452",
    options: {
      falseMeansFail: true,
    },
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "allowance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    gas: "76504",
  },
] as const;
