import { parseParams } from "../helpers/parseParams";
import { ChainId, IPluginCall } from "../types";
import { AllRequiredActions } from "./allActions";

export function getRequiredActions<I extends string>({
  pluginId,
  call,
  chainId,
}: {
  pluginId: I;
  call: IPluginCall;
  chainId: ChainId;
}) {
  const requiredActionsData = AllRequiredActions.find((data) => data[0] === pluginId);

  if (!requiredActionsData) return [];
  const requiredActions = requiredActionsData[1];

  const params = parseParams(call.params);

  return requiredActions({
    chainId,
    contractAddress: call.to,
    input: params,
    vaultAddress: call.from,
  });
}
