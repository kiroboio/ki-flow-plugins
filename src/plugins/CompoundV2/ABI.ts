export const cERC20_ABI = [
  {
    constant: false,
    inputs: [{ name: "repayAmount", type: "uint256" }],
    name: "repayBorrow",
    outputs: [{ name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "reserveFactorMantissa",
    outputs: [{ name: "reserveFactorMantissa", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "account", type: "address" }],
    name: "borrowBalanceCurrent",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "totalSupply", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "exchangeRateStored",
    outputs: [{ name: "exchangeRateStored", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "borrower", type: "address" },
      { name: "repayAmount", type: "uint256" },
    ],
    name: "repayBorrowBehalf",
    outputs: [{ name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "decimals", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOfUnderlying",
    outputs: [{ name: "balanceOfUnderlying", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCash",
    outputs: [{ name: "cash", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalBorrows",
    outputs: [{ name: "totalBorrows", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "comptroller",
    outputs: [{ name: "comptroller", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "initialExchangeRateMantissa",
    outputs: [{ name: "initialExchangeRateMantissa", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "underlying",
    outputs: [{ name: "underlying", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "totalBorrowsCurrent",
    outputs: [{ name: "totalBorrowsCurrent", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "redeemAmount", type: "uint256" }],
    name: "redeemUnderlying",
    outputs: [{ name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalReserves",
    outputs: [{ name: "totalReserves", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "borrowBalanceStored",
    outputs: [{ name: "borrowBalanceStored", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "mintAmount", type: "uint256" }],
    name: "mint",
    outputs: [{ name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "supplyRatePerBlock",
    outputs: [{ name: "supplyRatePerBlock", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "liquidator", type: "address" },
      { name: "borrower", type: "address" },
      { name: "seizeTokens", type: "uint256" },
    ],
    name: "seize",
    outputs: [{ name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "exchangeRateCurrent",
    outputs: [{ name: "exchangeRateCurrent", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "getAccountSnapshot",
    outputs: [
      { name: "errorCode", type: "uint256" },
      { name: "tokenBalance", type: "uint256" },
      { name: "borrowBalance", type: "uint256" },
      { name: "exchangeRateMantissa", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "borrowAmount", type: "uint256" }],
    name: "borrow",
    outputs: [{ name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "redeemTokens", type: "uint256" }],
    name: "redeem",
    outputs: [{ name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "allowance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "borrower", type: "address" },
      { name: "repayAmount", type: "uint256" },
      { name: "cTokenCollateral", type: "address" },
    ],
    name: "liquidateBorrow",
    outputs: [{ name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "borrowRatePerBlock",
    outputs: [{ name: "borrowRatePerBlock", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isCToken",
    outputs: [{ name: "isCToken", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;

export const Comptroller_ABI = [
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "cToken", type: "address" },
      { internalType: "address", name: "borrower", type: "address" },
      { internalType: "uint256", name: "borrowAmount", type: "uint256" },
    ],
    name: "borrowAllowed",
    outputs: [{ internalType: "uint256", name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  // {
  //   constant: false,
  //   inputs: [
  //     { internalType: "address", name: "holder", type: "address" },
  //     { internalType: "contract CToken[]", name: "cTokens", type: "address[]" },
  //   ],
  //   name: "claimComp",
  //   outputs: [],
  //   payable: false,
  //   stateMutability: "nonpayable",
  //   type: "function",
  // },
  {
    constant: false,
    inputs: [
      { internalType: "address[]", name: "holders", type: "address[]" },
      { internalType: "contract CToken[]", name: "cTokens", type: "address[]" },
      { internalType: "bool", name: "borrowers", type: "bool" },
      { internalType: "bool", name: "suppliers", type: "bool" },
    ],
    name: "claimComp", // claimComp(address[],address[],bool,bool)
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "claimComp", // claimComp(address)
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "closeFactorMantissa",
    outputs: [{ internalType: "uint256", name: "closeFactor", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "compAccrued",
    outputs: [{ internalType: "uint256", name: "compAccrued", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address[]", name: "cTokens", type: "address[]" }],
    name: "enterMarkets",
    outputs: [{ internalType: "uint256[]", name: "errorCodes", type: "uint256[]" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "cTokenAddress", type: "address" }],
    name: "exitMarket",
    outputs: [{ internalType: "uint256", name: "errorCode", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getAccountLiquidity",
    outputs: [
      { internalType: "uint256", name: "errorCode", type: "uint256" },
      { internalType: "uint256", name: "accountLiquidity", type: "uint256" },
      { internalType: "uint256", name: "shortfall", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCompAddress",
    outputs: [{ internalType: "address", name: "compAddress", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isComptroller",
    outputs: [{ internalType: "bool", name: "isComptroller", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "cToken", type: "address" }],
    name: "markets",
    outputs: [
      { internalType: "bool", name: "isListed", type: "bool" },
      { internalType: "uint256", name: "collateralFactorMantissa", type: "uint256" },
      { internalType: "bool", name: "isComped", type: "bool" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "maxAssets",
    outputs: [{ internalType: "uint256", name: "maxAssets", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "oracle",
    outputs: [{ internalType: "contract PriceOracle", name: "oracle", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;
