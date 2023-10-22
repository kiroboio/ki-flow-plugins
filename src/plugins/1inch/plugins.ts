import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { OneInchRouter_ABI } from "./ABI";
import { OneInch_Router } from "./constants";

const Router = createProtocolPluginsAsObject({
  protocol: "OneInch",
  abi: OneInchRouter_ABI,
  supportedContracts: OneInch_Router,
});

export const OneInch = { ...Router };

export type IOneInch = typeof OneInch;
export type OneInchArray = ProtocolPlugins<IOneInch>;
