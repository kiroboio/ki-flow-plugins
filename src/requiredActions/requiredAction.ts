import { ethers } from "ethers";

import { Plugin } from "../Plugin";
import { ChainId, RequiredApproval, Variable } from "../types";

export function createRequiredActionForPlugin<P extends Plugin<any, string>>({
  plugin,
  requiredActions,
}: {
  plugin: P;
  requiredActions: (args: {
    input: ReturnType<InstanceType<P>["get"]>;
    vaultAddress?: string | Variable;
    provider: ethers.providers.Provider;
    contractAddress: string | Variable;
    chainId: ChainId;
  }) => Promise<RequiredApproval[]> | RequiredApproval[];
}) {
  const pl = new plugin({ chainId: "1", rpcUrl: "none" });
  return [pl.id, requiredActions] as const;
}
