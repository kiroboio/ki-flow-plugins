import { createProtocolPluginsAsObject } from "../../Plugin";
import { LidoSTETHABI } from "./ABI";

const LidoSTETH = createProtocolPluginsAsObject({ protocol: "Lido", abi: LidoSTETHABI });
export const Lido = {
  ...LidoSTETH,
};
