var path = require('path');

module.exports = {
	context: __dirname,
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve('./public/assets/bundle/'),
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['react', 'es2015']
					}
				}
			}
		]
	}
}
