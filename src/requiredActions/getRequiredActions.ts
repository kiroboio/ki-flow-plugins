import { ethers } from "ethers";

import { parseParams } from "../helpers/parseParams";
import { ChainId, IPluginCall } from "../types";
import { AllRequiredActions } from "./allActions";

export async function getRequiredActions<I extends string>({
  pluginId,
  call,
  provider,
  chainId,
}: {
  pluginId: I;
  provider: ethers.providers.Provider;
  call: IPluginCall;
  chainId: ChainId;
}) {
  const requiredActionsData = AllRequiredActions.find((data) => data[0] === pluginId);

  if (!requiredActionsData) return [];
  const requiredActions = requiredActionsData[1];

  const params = parseParams(call.params);

  return await requiredActions({
    chainId,
    contractAddress: call.to,
    provider,
    input: params,
    vaultAddress: call.from,
  });
}
