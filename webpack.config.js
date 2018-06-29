var webpack = require("webpack");
var path = require("path");
var Dotenv = require('dotenv-webpack');

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
	entry : SRC_DIR + '/app/index.js', 
	output : {
		path: DIST_DIR+'/app',
		filename: 'bundle.js', 
		publicPath: '/app'
	},
	module: {
		loaders : [
			{
				test: /\.js/,
				include: SRC_DIR,
				//exclude: /(node_modules)/,
				loader: "babel-loader",
				query: {
					presets: ["react", "es2015", "stage-2"]
				}
			},
			{
				test: /\.css/,
				//include: SRC_DIR,
				//include: /(node_modules)/,
				loader: "style-loader!css-loader"
			}, 
			{
		        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
		        // include: SRC_DIR,
		        loader: 'url-loader'
		    },
		    {
			  test: /\.html/,
			  include: SRC_DIR,
			  loader: 'html-loader'
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			"window.jQuery": "jquery", 
			moment: 'moment'
		}),
		new Dotenv({
			path: './.env',
			// safe: true, load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
			systemvars: true
		})
	],
	node: {
		fs: 'empty'
	}
};

module.exports = config;