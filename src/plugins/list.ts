import * as plugins from "./plugins";

// Create a list of all the plugins that are imported in the plugins file.
export function getPlugins() {
  return Object.values(plugins).reduce((acc, protocolPlugins) => {
    return acc.concat(Object.values(protocolPlugins)) as plugins.AllPlugins;
  }, [] as plugins.AllPlugins);
}
