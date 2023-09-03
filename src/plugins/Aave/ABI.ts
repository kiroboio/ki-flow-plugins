export const AaveV2_LendingPoolABI = [
  {
    inputs: [],
    name: "FLASHLOAN_PREMIUM_TOTAL",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_NUMBER_RESERVES",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
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
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "getConfiguration",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.ReserveConfigurationMap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
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
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "data",
                type: "uint256",
              },
            ],
            internalType: "struct DataTypes.ReserveConfigurationMap",
            name: "configuration",
            type: "tuple",
          },
          {
            internalType: "uint128",
            name: "liquidityIndex",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "variableBorrowIndex",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentLiquidityRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentVariableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentStableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint40",
            name: "lastUpdateTimestamp",
            type: "uint40",
          },
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
          {
            internalType: "address",
            name: "interestRateStrategyAddress",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "id",
            type: "uint8",
          },
        ],
        internalType: "struct DataTypes.ReserveData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
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
        name: "totalCollateralETH",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalDebtETH",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableBorrowsETH",
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
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserConfiguration",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.UserConfigurationMap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
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
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
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
        name: "rateMode",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "repay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
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
        name: "rateStrategyAddress",
        type: "address",
      },
    ],
    name: "setReserveInterestRateStrategyAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
        name: "rateMode",
        type: "uint256",
      },
    ],
    name: "swapBorrowRateMode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const AaveV2_ProtocolDataProviderABI = [
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
        name: "availableLiquidity",
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
  },
] as const;
