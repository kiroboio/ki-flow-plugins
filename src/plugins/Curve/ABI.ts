export const CurvePoolABI = [
  {
    name: "get_virtual_price",
    outputs: [{ type: "uint256", name: "virtualPrice" }],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: "1133537",
  },
  {
    name: "calc_token_amount",
    outputs: [{ type: "uint256", name: "tokenAmount" }],
    inputs: [
      { type: "uint256[3]", name: "amounts" },
      { type: "bool", name: "deposit" },
    ],
    stateMutability: "view",
    type: "function",
    gas: "4508776",
  },
  {
    name: "add_liquidity",
    outputs: [],
    inputs: [
      { type: "uint256[3]", name: "amounts" },
      { type: "uint256", name: "min_mint_amount" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: "6954858",
  },
  {
    name: "get_dy",
    outputs: [{ type: "uint256", name: "dy" }],
    inputs: [
      { type: "int128", name: "i" },
      { type: "int128", name: "j" },
      { type: "uint256", name: "dx" },
    ],
    stateMutability: "view",
    type: "function",
    gas: "2673791",
  },
  {
    name: "get_dy_underlying",
    outputs: [{ type: "uint256", name: "dy" }],
    inputs: [
      { type: "int128", name: "i" },
      { type: "int128", name: "j" },
      { type: "uint256", name: "dx" },
    ],
    stateMutability: "view",
    type: "function",
    gas: "2673474",
  },
  {
    name: "exchange",
    outputs: [],
    inputs: [
      { type: "int128", name: "i" },
      { type: "int128", name: "j" },
      { type: "uint256", name: "dx" },
      { type: "uint256", name: "min_dy" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: "250000",
  },
  {
    name: "remove_liquidity",
    outputs: [],
    inputs: [
      { type: "uint256", name: "_amount" },
      { type: "uint256[3]", name: "min_amounts" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: "192846",
  },
  {
    name: "remove_liquidity_imbalance",
    outputs: [],
    inputs: [
      { type: "uint256[3]", name: "amounts" },
      { type: "uint256", name: "max_burn_amount" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: "6951851",
  },
  {
    name: "calc_withdraw_one_coin",
    outputs: [{ type: "uint256", name: "amount" }],
    inputs: [
      { type: "uint256", name: "token_amount" },
      { type: "int128", name: "i" },
    ],
    stateMutability: "view",
    type: "function",
    gas: "1102",
  },
  {
    name: "remove_liquidity_one_coin",
    outputs: [],
    inputs: [
      { type: "uint256", name: "_token_amount" },
      { type: "int128", name: "i" },
      { type: "uint256", name: "min_amount" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: "250000",
  },
  {
    name: "balances",
    outputs: [{ type: "uint256", name: "value" }],
    inputs: [{ type: "uint256", name: "arg0" }],
    stateMutability: "view",
    type: "function",
    gas: "2250",
  },
] as const;
