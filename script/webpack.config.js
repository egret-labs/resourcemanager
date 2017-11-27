const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const version = require("../package.json").version;
const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [
        path.resolve(__dirname, 'my_modules'),
        path.resolve(__dirname, '../', 'node_modules'),
    ]
};
const module_loader = {
    loaders: [
        {
            test: /\.ts(x?)$/,
            loaders: ['ts-loader']
        }
    ]
};

const config_cli = {
    target: 'node',
    context: path.join(__dirname, 'src'),
    resolve,
    node: {
        __dirname: false
    },
    module: module_loader,
    entry: {
        "cli": "./cli"
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

const config_library = {
    target: 'node',
    context: path.join(__dirname, 'src'),
    resolve,
    node: {
        __dirname: false
    },
    module: module_loader,
    entry: {
        "vendor": "./index"
    },
    output: {
        path: path.join(__dirname, 'out'),
        filename: '[name].js',
        library: "vendor",
        libraryTarget: "umd"

    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: "\"" + version + "\""
        })
    ]
};

module.exports = [config_library, config_cli];