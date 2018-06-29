const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  // set this to your entry point
  entry: "./src/index.js",

  // change this to your output path
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js"
  },

  // create a map file for debugging
  devtool: 'source-map',

  // configure the loaders
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ],
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        query: {
          presets: ['env', 'react', 'react-app', 'stage-3'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
          compact: false
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    })
  ],
  devServer: {
    contentBase: "./dist"
  },
  ///////////  uncomment this for production ////////////////
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false
  //     }
  //   }),
  //   new webpack.DefinePlugin({
  //     'process.env': {'NODE_ENV': JSON.stringify('production')}
  //   })
  // ],////////////////////////////////////////////////////////

  watch: true // change this to true to keep webpack running
};