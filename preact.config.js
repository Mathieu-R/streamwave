import async from 'preact-cli-plugin-fast-async';
import { generateSw as workbox } from 'preact-cli-workbox-plugin';

export default (config, env, helpers) => {
  // by default async functions are transpiled and depend
  // on regenerator/runtime which produce large bundle size.
  // This plugin, converts async/await into promises.
  async(config);

  // remove sourcemaps in production
  if (env.isProd) {
    const { plugin } = helpers.getPluginsByName(config, "UglifyJsPlugin")[0];
    plugin.options.sourceMap = false;
  }

  // use workbox instead of sw-precache.
  workbox(config, helpers, {});
}
