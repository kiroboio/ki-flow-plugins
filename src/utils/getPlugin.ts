import { Plugin } from "../Plugin";
import { SmartPlugin } from "../Plugin/smartPlugin";
import { getPlugins } from "../plugins";
import * as plugins from "../smartPlugins";

export function getPlugin(pluginId: string): Plugin<any, any> | SmartPlugin | undefined {
  const allSimplePlugins = getPlugins() as Plugin<any, any>[];
  const allSmartPlugins = Object.values(plugins).reduce((acc, cur) => {
    return [...acc, ...Object.values(cur)];
  }, [] as SmartPlugin[]);
  const allPlugins = [...allSimplePlugins, ...allSmartPlugins];
  return allPlugins.find((plugin) => plugin.id === pluginId);
}
