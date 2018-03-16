const webpack = require('webpack')
const path = require('path')
const { src } = require('./config')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    bundle: [`./${src}/js/main.js`]
  },
  output: {
    path: path.resolve(__dirname, 'dest', 'assets', 'js'),
    publicPath: '/assets/js/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three'
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
