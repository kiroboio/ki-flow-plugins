import { UniswapV3ExactInput } from "./exactInput";
import { UniswapV3ExactInputSingle } from "./exactInputSingle";
import { UniswapV3ExactOutput } from "./exactOutput";
import { UniswapV3ExactOutputSingle } from "./exactOutputSingle";
import { UniswapV3Mint } from "./mint";

export const UniswapV3RequiredActions = [
  UniswapV3ExactInput,
  UniswapV3ExactInputSingle,
  UniswapV3ExactOutput,
  UniswapV3ExactOutputSingle,
  UniswapV3Mint,
];
