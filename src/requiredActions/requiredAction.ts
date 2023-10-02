import { Plugin } from "../Plugin";
import { ChainId, RequiredApproval } from "../types";

export function createRequiredActionForPlugin<P extends Plugin<any, string>>({
  plugin,
  requiredActions,
}: {
  plugin: P;
  requiredActions: (args: {
    input: ReturnType<InstanceType<P>["get"]>;
    vaultAddress: string;
    contractAddress?: string;
    chainId: ChainId;
  }) => RequiredApproval[];
}) {
  const pl = new plugin({ chainId: "1" });
  return [pl.id, requiredActions] as const;
}
