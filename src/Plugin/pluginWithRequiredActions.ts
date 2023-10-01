import { ChainId, RequiredApproval } from "../types";
import { Plugin } from "./plugin";

export function createPluginWithRequiredActions<P extends Plugin<any, string> = Plugin<any, string>>({
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
  // @ts-ignore
  return class extends plugin {
    readonly vaultAddress: string;
    // constructor(args: ConstructorParameters<P>[0] & { vaultAddress: string }) {
    constructor(args: {
      chainId: ChainId;
      vaultAddress: string;
      contractAddress?: string;
      input?: ReturnType<InstanceType<P>["get"]>;
    }) {
      super(args);
      this.vaultAddress = args.vaultAddress;
    }

    public getRequiredActions(): RequiredApproval[] {
      return requiredActions({
        input: this.get() as ReturnType<InstanceType<P>["get"]>,
        vaultAddress: this.vaultAddress,
        contractAddress: this.contractAddress,
        chainId: this.chainId,
      });
    }
  };
}
