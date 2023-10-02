import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { LidoSTETHABI } from "./ABI";

const LidoSTETH = createProtocolPluginsAsObject({ protocol: "Lido", abi: LidoSTETHABI });

export const Lido = {
  ...LidoSTETH,
};

export type ILido = typeof Lido;
export type LidoArray = ProtocolPlugins<ILido>;
