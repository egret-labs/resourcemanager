var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var version = require("../package.json").version;

const outPath = path.join(__dirname, 'out');

const config = {
    /**
     *  /////////////////////////////////source-map////////////////////////////////
     *  在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包文件的构建速度
     *  /////////////////////////////////cheap-module-source-map////////////////////////////////
     *  在一个单独的文件中生成一个不带列映射的map，不带列映射提高项目构建速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；
     *  /////////////////////////////////eval-source-map////////////////////////////////
     *  使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。不过在开发阶段这是一个非常好的选项，但是在生产阶段一定不要用这个选项；
     *  /////////////////////////////////cheap-module-eval-source-map////////////////////////////////
     *  这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；
     */
    // devtool: 'source-map',//默认source-map调试时无法查看ts源
    target: 'node',
    context: path.join(__dirname, 'src'),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, '../', 'node_modules'),
            path.resolve(__dirname, 'src')
        ]
    },
    node: {
        __dirname: false
    },
    module: {
        loaders: [
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader'
            }
        ]
    },
    entry: {
        "cli": "cli",
        "vendor": "index"
    },
    output: {
        path: outPath,
        filename: '[name].js',
        library: 'vendor',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: "\"" + version + "\""
        }),
    ]
};

module.exports = config;