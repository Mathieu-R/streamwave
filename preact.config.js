import path from 'path';
import async from 'preact-cli-plugin-fast-async';
import { injectManifest as workbox } from 'preact-cli-workbox-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default (config, env, helpers) => {
  // by default async functions are transpiled and depend
  // on regenerator/runtime which produce large bundle size.
  // This plugin, converts async/await into promises.
  async(config);

  // remove sourcemaps in production
  if (env.isProd) {
    const {plugin} = helpers.getPluginsByName(config, "UglifyJsPlugin")[0];
    // https://github.com/developit/preact-cli/issues/434
    if (plugin) plugin.options.sourceMap = false;
  }

  // use workbox instead of sw-precache.
  // here I inject the precache manifest
  // into my current service-worker
  const sw = path.join(__dirname, 'src/sw.js');
  workbox(config, helpers, {
    swSrc: sw,
    globPatterns: [
      "**/*.{js,css,html,json,jpg,png,svg,webp}"
    ]
  });

  // copy idbKeyval so it's available in service-worker
  if (env.isProd) {
    config.plugins.push(new CopyWebpackPlugin([{from: `${__dirname}/src/third_party/idb-keyval.min.js`, to: `${__dirname}/build/third_party/idb-keyval.min.js`}]));
  }
}
