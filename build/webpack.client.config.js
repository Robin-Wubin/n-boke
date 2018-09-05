const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');
const fs = require("fs");
const path = require("path");

const config = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  resolve: {
    alias: {
      'create-api': './create-api-client.js'
    }
  },
  plugins: [
      // new WebpackDeepScopeAnalysisPlugin(),
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new VueSSRClientPlugin()
  ]
})

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: '../service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst'
        },
        {
          urlPattern: /\/(top|new|show|ask|jobs)/,
          handler: 'networkFirst'
        },
        {
          urlPattern: '/item/:id',
          handler: 'networkFirst'
        },
        {
          urlPattern: '/user/:id',
          handler: 'networkFirst'
        }
      ]
    }),
      new WebpackOnBuildPlugin(function(stats) {
          const newlyCreatedAssets = stats.compilation.assets;
          const unlinked = [];
          fs.readdir(path.resolve(__dirname, '../public/dist'), (err, files) => {
              files.forEach(file => {
                  if (!newlyCreatedAssets[file]) {
                      fs.unlink(path.resolve(__dirname, '../public/dist/' + file));
                      unlinked.push(file);
                  }
              });
              if (unlinked.length > 0) {
                  console.log('删除文件: ', unlinked);
              }
          });
      })
  )
}

module.exports = config
