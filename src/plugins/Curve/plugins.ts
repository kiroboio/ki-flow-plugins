import { createProtocolPluginsAsObject } from "../../Plugin";
import { ProtocolPlugins } from "../../types";
import { CurvePoolABI } from "./ABI";

// TODO: For Curve there should be 3 different plugins, because pool has strict array lengths and pool can have 2, 3 or 4 assets.
// For example, uint256[2], uint256[3], uint256[4] etc.

const CurvePool = createProtocolPluginsAsObject({
  protocol: "Curve",
  abi: CurvePoolABI,
});

export const Curve = { ...CurvePool };

export type Curve = typeof Curve;
export type CurveArray = ProtocolPlugins<Curve>;
