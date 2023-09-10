export const LidoSTETHABI = [
  {
    constant: true,
    inputs: [{ name: "_ethAmount", type: "uint256" }],
    name: "getSharesByPooledEth",
    outputs: [{ name: "sharesByPooledETH", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isStakingPaused",
    outputs: [{ name: "isStakingPaused", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getTotalPooledEther",
    outputs: [{ name: "totalPooledEther", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  // {
  //   constant: true,
  //   inputs: [],
  //   name: "getBufferedEther",
  //   outputs: [{ name: "", type: "uint256" }],
  //   payable: false,
  //   stateMutability: "view",
  //   type: "function",
  // },
  {
    constant: true,
    inputs: [],
    name: "getCurrentStakeLimit",
    outputs: [{ name: "currentStakeLimit", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getStakeLimitFullInfo",
    outputs: [
      { name: "isStakingPaused", type: "bool" },
      { name: "isStakingLimitSet", type: "bool" },
      { name: "currentStakeLimit", type: "uint256" },
      { name: "maxStakeLimit", type: "uint256" },
      { name: "maxStakeLimitGrowthBlocks", type: "uint256" },
      { name: "prevStakeLimit", type: "uint256" },
      { name: "prevStakeBlockNumber", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "sharesAmount", type: "uint256" },
    ],
    name: "transferSharesFrom",
    outputs: [{ name: "success", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "sharesAmount", type: "uint256" }],
    name: "getPooledEthByShares",
    outputs: [{ name: "pooledEthByShares", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "token", type: "address" }],
    name: "allowRecoverability",
    outputs: [{ name: "allowRecoverability", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "recipient", type: "address" },
      { name: "sharesAmount", type: "uint256" },
    ],
    name: "transferShares",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "referral", type: "address" }],
    name: "submit",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  // {
  //   constant: false,
  //   inputs: [
  //     { name: "_maxDepositsCount", type: "uint256" },
  //     { name: "_stakingModuleId", type: "uint256" },
  //     { name: "_depositCalldata", type: "bytes" },
  //   ],
  //   name: "deposit",
  //   outputs: [],
  //   payable: false,
  //   stateMutability: "nonpayable",
  //   type: "function",
  // },
  {
    constant: true,
    inputs: [],
    name: "getTotalShares",
    outputs: [{ name: "totalShares", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getDepositableEther",
    outputs: [{ name: "depositableEther", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "sharesOf",
    outputs: [{ name: "shares", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;
