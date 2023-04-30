
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
  entry: '/src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  devServer: {
    open: true,
    hot: true,
    port: '4200',
  },
  module: {
    rules: [
       {
          test: /\.(m?js|ts)$/,
          exclude: /(node_modules)/,
          use:  [`swc-loader`]
        }
    ]
  },
  resolve: {
    extensions: [`.js`, `.ts`],
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}