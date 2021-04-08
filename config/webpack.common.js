const paths = require('./paths');
const HtmlWebpacPlugin = require("html-webpack-plugin")

//设置常量
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const imageInlineSizeLimit = 4 * 1024;

module.exports = function (options) {
    return {
        mode: options.mode,
        entry: paths.appSrc,
        output: {
            path: paths.appBuild,
            publicPath: "/"
        },
        cache: {
            //使用持久化缓存
            type: "filesystem",//memory:使用内容混村filesystem:使用文件缓存
        },
        devtool: false,
        resolve: {
            modules: [paths.appNodeModules],
            extensions: ['.js', '.jsx', '.css'],
            alias: {
                moment$: 'moment/moment.js',
                '@src': paths.appSrc,
                '@public': paths.appPublic,
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    "@babel/preset-env",
                                    "@babel/preset-react"
                                ]
                            }
                        }
                    ]
                },
                {
                    oneOf: [
                        {
                            test: cssRegex,
                            exclude: cssModuleRegex,
                            use: ['style-loader', {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1  // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                                }
                            }, 'postcss-loader'],
                        },
                        {
                            test: sassRegex,
                            exclude: sassModuleRegex,
                            use: ['style-loader', {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1 // 查询参数 importLoaders，用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader
                                }
                            }, 'postcss-loader', 'sass-loader'],
                        },
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit // 4kb
                                }
                            }
                        },
                        {
                            test: /\.(eot|svg|ttf|woff|woff2?)$/,
                            type: 'asset/resource'
                        },
                    ]
                }
            ]
        },
        devServer: {

        },
        plugins: [
            new HtmlWebpacPlugin({
                template: "./public/index.html",
            }),
            ...options.plugins,
        ],
        stats: options.stats, //打包日志发生错误和新的编译时输出
    };
};