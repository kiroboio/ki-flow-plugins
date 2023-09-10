import { createProtocolPluginsAsObject } from "../../Plugin";
import { LidoSTETHABI } from "./ABI";

const LidoSTETH = createProtocolPluginsAsObject({ abi: LidoSTETHABI });
export const Lido = {
  ...LidoSTETH,
};
