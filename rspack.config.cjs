const path = require('node:path');
const {rspack} = require('@rspack/core');
const {tanstackRouter} = require('@tanstack/router-plugin/rspack');

module.exports = (_, {mode} = {}) => {
	return {
		entry: './src/index.tsx',
		mode: mode || 'development',
		output: {
			filename: 'index.js',
			path: path.join(__dirname, './.build'),
			clean: true,
			publicPath: './'
		},
		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
			alias: {
				'@store': path.resolve(__dirname, 'src/store'),
				'@types': path.resolve(__dirname, 'src/types'),
				'@utils': path.resolve(__dirname, 'src/utils'),
			}
		},
		module: {
			rules: [
				{
					test: /\.[jt]sx?$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								['@babel/preset-react', {runtime: 'automatic'}],
								'@babel/preset-typescript'
							],
							cacheDirectory: true
						}
					}
				},
				{
					test: /\.module\.s[ac]ss$/i,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: {
									localIdentName: '[local]__[hash:base64:5]'
								}
							}
						},
						'sass-loader'
					]
				},
				{
					test: /\.s[ac]ss$/i,
					exclude: /\.module\.s[ac]ss$/i,
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader']
				},
				{
					test: /\.(svg|jpe?g|tiff|png|ico)$/i,
					type: 'asset/resource'
				}
			]
		},
		plugins: [
			new rspack.HtmlRspackPlugin({
				template: './public/index.html'
			}),
			tanstackRouter({
				target: 'react',
				autoCodeSplitting: true,
				routesDir: path.resolve(__dirname, 'src/routes'),
				generatedRouteTree: path.resolve(__dirname, 'src/routeTree.gen.ts')
			})
		],
		devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
		devServer: {
			hot: true,
			open: true,
			port: 9005,
			host: 'localhost',
			historyApiFallback: {
				index: '/index.html',
				disableDotRule: true
			}
		}
	};
};
