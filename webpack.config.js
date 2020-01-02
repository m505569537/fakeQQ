const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tsImportPluginFactory = require('ts-import-plugin')

const theme = require('./less')

module.exports = (env) => {
    const config ={
        mode: env === 'development' ? 'development' : 'production',
        entry: {
            app: './src/index.js'
        },
        output: {
            filename: env === 'development' ? 'js/[name].dev.js' : '[name].[chunkhash].js',
            chunkFilename: env === 'development' ? 'js/[name].dev.js' : '[name].[chunkhash].js',
            path: path.resolve(__dirname, 'dist')
        },
        devServer: {
            hot: true,
            // index: 'main.html',
            // contentBase: path.join(__dirname, 'src'),
            contentBase: './dist',
            compress: true,
            // open: 'Google Chrome',
            port: 8080,
            quiet: true
        },
        module: {
            rules: [
                {
                    test: /\.(css|less)$/,
                    use: [
                        'css-hot-loader',  //实现样式文件的热更新
                        MiniCssExtractPlugin.loader,
                        // 'style-loader',
                        'css-loader',
                        'postcss-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                modifyVars: theme,
                                javascriptEnabled: true
                            }
                        }
                    ]
                },
                {
                    test: /\.js[x]?$/,
                    // 支持javascript按需加载antd
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                ['import', {
                                    libraryName: 'antd',
                                    libraryDirectory: 'lib',
                                    style: true
                                }]
                            ]
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.ts[x]?$/,
                    // 支持typescript按需加载antd
                    loader: "awesome-typescript-loader",
                    options: {
                        useCache: true,
                        useBabel: false,
                        getCustomTransformers: () => ({
                            before: [tsImportPluginFactory({
                                libraryName: 'antd',
                                libraryDirectory: 'lib',
                                style: true
                            })]
                        })
                    }

                }
            ]
        },
        resolve: {
            // 这样在通过import引入文件的时候就不需要相关的扩展名了，类似'.js .jsx'
            extensions: ['.js', '.jsx', '.tsx', '.ts', '.less']
        },
        plugins: [
            // HMR要根据允许环境来确定是否需要
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                title: 'hh',
                filename: 'index.html',
                template: 'index.html',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true
                }
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env)
            }),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                // 本来css文件是被打包到js文件中的，这里将css抽离出来单独打包，但也会造成css文件无法热更新的问题
                filename: env === 'development' ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
                chunkFilename: env === 'development' ? 'css/[name].css' : 'css/[name].[contenthash:8].chunk.css'
            }),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: 'vendor'
            }
        }
    };

    return config;
}