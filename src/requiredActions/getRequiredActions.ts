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
  const requiredActionsData = AllRequiredActions.find((data) => data[0].id === pluginId);

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

export async function getRequiredActionsFromSignature({
  signature,
  provider,
  chainId,
  call,
}: {
  provider: ethers.providers.Provider;
  signature: string;
  chainId: ChainId;
  call: IPluginCall;
}) {
  const requiredActionsData = AllRequiredActions.find(
    (data) => data[0].functionSignatureHash.toLowerCase() === signature.toLowerCase()
  );

  if (!requiredActionsData) return [];
  const requiredActions = requiredActionsData[1];

  const input = parseParams(call.params);

  return await requiredActions({
    input,
    chainId,
    contractAddress: signature,
    provider,
    vaultAddress: call.from,
  });
}
