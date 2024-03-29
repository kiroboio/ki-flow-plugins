export const cometABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "borrowBalanceOf",
    outputs: [{ internalType: "uint256", name: "borrowBalanceOf", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "45000",
  },
  {
    inputs: [],
    name: "borrowPerSecondInterestRateBase",
    outputs: [{ internalType: "uint256", name: "borrowPerSecondInterestRateBase", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [],
    name: "borrowPerSecondInterestRateSlopeHigh",
    outputs: [{ internalType: "uint256", name: "borrowPerSecondInterestRateSlopeHigh", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [],
    name: "borrowPerSecondInterestRateSlopeLow",
    outputs: [{ internalType: "uint256", name: "borrowPerSecondInterestRateSlopeLow", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [
      { internalType: "address", name: "manager", type: "address" },
      { internalType: "bool", name: "isAllowed", type: "bool" },
    ],
    name: "allow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "65000",
  },
  {
    inputs: [{ internalType: "uint8", name: "index", type: "uint8" }],
    name: "getAssetInfo",
    outputs: [
      {
        components: [
          { internalType: "uint8", name: "offset", type: "uint8" },
          { internalType: "address", name: "asset", type: "address" },
          { internalType: "address", name: "priceFeed", type: "address" },
          { internalType: "uint64", name: "scale", type: "uint64" },
          { internalType: "uint64", name: "borrowCollateralFactor", type: "uint64" },
          { internalType: "uint64", name: "liquidateCollateralFactor", type: "uint64" },
          { internalType: "uint64", name: "liquidationFactor", type: "uint64" },
          { internalType: "uint128", name: "supplyCap", type: "uint128" },
        ],
        internalType: "struct CometCore.AssetInfo",
        name: "assetInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getAssetInfoByAddress",
    outputs: [
      {
        components: [
          { internalType: "uint8", name: "offset", type: "uint8" },
          { internalType: "address", name: "asset", type: "address" },
          { internalType: "address", name: "priceFeed", type: "address" },
          { internalType: "uint64", name: "scale", type: "uint64" },
          { internalType: "uint64", name: "borrowCollateralFactor", type: "uint64" },
          { internalType: "uint64", name: "liquidateCollateralFactor", type: "uint64" },
          { internalType: "uint64", name: "liquidationFactor", type: "uint64" },
          { internalType: "uint128", name: "supplyCap", type: "uint128" },
        ],
        internalType: "struct CometCore.AssetInfo",
        name: "assetInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [{ internalType: "uint256", name: "utilization", type: "uint256" }],
    name: "getBorrowRate",
    outputs: [{ internalType: "uint64", name: "borrowRate", type: "uint64" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getCollateralReserves",
    outputs: [{ internalType: "uint256", name: "borrowRate", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "45000",
  },
  {
    inputs: [{ internalType: "address", name: "priceFeed", type: "address" }],
    name: "getPrice",
    outputs: [{ internalType: "uint256", name: "borrowRate", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "55000",
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [{ internalType: "int256", name: "reserves", type: "int256" }],
    stateMutability: "view",
    type: "function",
    gas: "55000",
  },
  {
    inputs: [{ internalType: "uint256", name: "utilization", type: "uint256" }],
    name: "getSupplyRate",
    outputs: [{ internalType: "uint64", name: "supplyRate", type: "uint64" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [],
    name: "getUtilization",
    outputs: [{ internalType: "uint256", name: "utilization", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  // {
  //   inputs: [{ internalType: "address", name: "", type: "address" }],
  //   name: "liquidatorPoints",
  //   outputs: [
  //     { internalType: "uint32", name: "numAbsorbs", type: "uint32" },
  //     { internalType: "uint64", name: "numAbsorbed", type: "uint64" },
  //     { internalType: "uint128", name: "approxSpend", type: "uint128" },
  //     { internalType: "uint32", name: "_reserved", type: "uint32" },
  //   ],
  //   stateMutability: "view",
  //   type: "function",
  // },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "baseAmount", type: "uint256" },
    ],
    name: "quoteCollateral",
    outputs: [{ internalType: "uint256", name: "quoteCollateral", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "80000",
  },
  {
    inputs: [],
    name: "storeFrontPriceFactor",
    outputs: [{ internalType: "uint256", name: "storeFrontPriceFactor", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "supply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "110000",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "supplyFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "130000",
  },
  {
    inputs: [],
    name: "supplyPerSecondInterestRateBase",
    outputs: [{ internalType: "uint256", name: "supplyPerSecondInterestRateBase", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [],
    name: "supplyPerSecondInterestRateSlopeHigh",
    outputs: [{ internalType: "uint256", name: "supplyPerSecondInterestRateSlopeHigh", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [],
    name: "supplyPerSecondInterestRateSlopeLow",
    outputs: [{ internalType: "uint256", name: "supplyPerSecondInterestRateSlopeLow", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "supplyTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "120000",
  },
  {
    inputs: [],
    name: "totalBorrow",
    outputs: [{ internalType: "uint256", name: "totalBorrow", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "totalSupply", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [{ internalType: "address", name: "collateralAsset", type: "address" }],
    name: "totalsCollateral",
    outputs: [
      { internalType: "uint128", name: "totalSupplyAsset", type: "uint128" },
      { internalType: "uint128", name: "reserved", type: "uint128" },
    ],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "155000",
  },
  {
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferAssetFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "155000",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "190000",
  },
  {
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdrawFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "200000",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdrawTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "200000",
  },
] as const;
