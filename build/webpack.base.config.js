const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.styl'],
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
        {
            test: /\.css/,
            use: isProd
                ? ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: { minimize: true }
                        },
                        'stylus-loader'
                    ],
                    fallback: 'vue-style-loader'
                })
                : ['vue-style-loader', 'css-loader', 'stylus-loader']
        },
        { test: /.(ttf|eot|woff|woff2)([?]?.*)$/, loader: "file-loader" },
      {
        test: /\.styl(us)?$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: { minimize: true }
                },
                'stylus-loader'
              ],
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader', 'stylus-loader']
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
        new LodashModuleReplacementPlugin,
        new VueLoaderPlugin(),
          new UglifyJSPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //   compress: { warnings: false }
        // }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        }),
          new webpack.ProvidePlugin({
              'window.Quill': 'quill'
          })
      ]
    : [
        new VueLoaderPlugin(),
        new FriendlyErrorsPlugin(),
          new webpack.ProvidePlugin({
              'window.Quill': 'quill'
          })
      ]
}
