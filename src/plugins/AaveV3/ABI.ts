export const AaveV3_PoolABI = [
  {
    inputs: [],
    name: "MAX_STABLE_RATE_BORROW_SIZE_PERCENT",
    outputs: [
      {
        internalType: "uint256",
        name: "MAX_STABLE_RATE_BORROW_SIZE_PERCENT",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "30000",
  },
  {
    inputs: [],
    name: "POOL_REVISION",
    outputs: [
      {
        internalType: "uint256",
        name: "POOL_REVISION",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "30000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "interestRateMode",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "referralCode",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "borrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "440000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "referralCode",
        type: "uint16",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    deposit: "210000",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "id",
        type: "uint16",
      },
    ],
    name: "getReserveAddressById",
    outputs: [
      {
        internalType: "address",
        name: "reserveAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "30000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getReserveNormalizedIncome",
    outputs: [
      {
        internalType: "uint256",
        name: "reserveNormalizedIncome",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getReserveNormalizedVariableDebt",
    outputs: [
      {
        internalType: "uint256",
        name: "reserveNormalizedVariableDebt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserAccountData",
    outputs: [
      {
        internalType: "uint256",
        name: "totalCollateralBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalDebtBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableBorrowsBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentLiquidationThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "healthFactor",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "210000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserEMode",
    outputs: [
      {
        internalType: "uint256",
        name: "eMode",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "35000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collateralAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "debtAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "debtToCover",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "receiveAToken",
        type: "bool",
      },
    ],
    name: "liquidationCall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "630000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "interestRateMode",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "repay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "250000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "interestRateMode",
        type: "uint256",
      },
    ],
    name: "repayWithATokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "215000",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "categoryId",
        type: "uint8",
      },
    ],
    name: "setUserEMode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "70000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "bool",
        name: "useAsCollateral",
        type: "bool",
      },
    ],
    name: "setUserUseReserveAsCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "130000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "referralCode",
        type: "uint16",
      },
    ],
    name: "supply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "270000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "245000",
  },
] as const;

export const AaveV3_ProtocolDataProviderABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getATokenTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "aTokenTotalSupply",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "78693",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getDebtCeiling",
    outputs: [
      {
        internalType: "uint256",
        name: "debtCeiling",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [],
    name: "getDebtCeilingDecimals",
    outputs: [
      {
        internalType: "uint256",
        name: "debtCeilingDecimals",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
    gas: "25000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getInterestRateStrategyAddress",
    outputs: [
      {
        internalType: "address",
        name: "irStrategyAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "63000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getLiquidationProtocolFee",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidationProtocolFee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getPaused",
    outputs: [
      {
        internalType: "bool",
        name: "isPaused",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getReserveCaps",
    outputs: [
      {
        internalType: "uint256",
        name: "borrowCap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "supplyCap",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getReserveConfigurationData",
    outputs: [
      {
        internalType: "uint256",
        name: "decimals",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liquidationThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liquidationBonus",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserveFactor",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "usageAsCollateralEnabled",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "borrowingEnabled",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "stableBorrowRateEnabled",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isFrozen",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getReserveData",
    outputs: [
      {
        internalType: "uint256",
        name: "unbacked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "accruedToTreasuryScaled",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalStableDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalVariableDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liquidityRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "variableBorrowRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stableBorrowRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "averageStableBorrowRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liquidityIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "variableBorrowIndex",
        type: "uint256",
      },
      {
        internalType: "uint40",
        name: "lastUpdateTimestamp",
        type: "uint40",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "115000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getReserveEModeCategory",
    outputs: [
      {
        internalType: "uint256",
        name: "reserveEModeCategory",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getReserveTokensAddresses",
    outputs: [
      {
        internalType: "address",
        name: "aTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "stableDebtTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "variableDebtTokenAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "65000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getSiloedBorrowing",
    outputs: [
      {
        internalType: "bool",
        name: "isSiloedBorrowingEnabled",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getTotalDebt",
    outputs: [
      {
        internalType: "uint256",
        name: "totalDebt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "95000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getUnbackedMintCap",
    outputs: [
      {
        internalType: "uint256",
        name: "unbakcedMintCap",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "40000",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserReserveData",
    outputs: [
      {
        internalType: "uint256",
        name: "currentATokenBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentStableDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentVariableDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "principalStableDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "scaledVariableDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stableBorrowRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liquidityRate",
        type: "uint256",
      },
      {
        internalType: "uint40",
        name: "stableRateLastUpdated",
        type: "uint40",
      },
      {
        internalType: "bool",
        name: "usageAsCollateralEnabled",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "180000",
  },
] as const;
