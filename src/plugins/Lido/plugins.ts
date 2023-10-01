import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { LidoSTETHABI } from "./ABI";

const LidoSTETH = createProtocolPluginsAsObject({ protocol: "Lido", abi: LidoSTETHABI });

export const Lido = {
  ...LidoSTETH,
};

export type Lido = typeof Lido;
export type LidoArray = ProtocolPlugins<Lido>;
