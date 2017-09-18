var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var version = require("../package.json").version;

const config = {
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
                loaders: ['ts-loader']
            }
        ]
    },
    entry: {
        "cli": "cli"
    },
    output: {
        path: path.join(__dirname, 'out'),
        filename: '[name].js',

    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: "\"" + version + "\""
        }),
        new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
    ]
};

module.exports = config;