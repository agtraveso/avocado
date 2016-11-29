const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node', // in order to ignore built-in modules like path, fs, etc.
	externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
	entry: './app/app',
	output: {
		path: 'app',
		filename: 'bundle.js',
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			loaders: ['babel-loader'],
			exclude: '/node_modules/'
		},
		{
			test: /\.scss$/,
			loaders: ['style-loader', 'css-loader', 'sass-loader']
		}]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};
