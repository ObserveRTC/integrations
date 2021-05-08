const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {version} = require('../../package.json')
const {readFileSync} = require('fs')

const libraryName = process.env.LIBRARY_NAME
const buildDetails = (name = '') => {
    switch (name) {
        case 'Jitsi':
            return {entry: './build/jitsi/index.js', filename: 'jitsi.integration.js'}
        case 'TokBox':
            return {entry: './build/tokbox/index.js', filename: 'tokbox.integration.js'}
        case 'MediaSoup':
            return {entry: './build/mediasoup/index.js', filename: 'mediasoup.integration.js'}
        case 'JanusIntegration':
            return {entry: './build/janus/index.js', filename: 'janus.integration.js'}
        case 'PeerJS':
            return {entry: './build/peerjs/index.js', filename: 'peerjs.integration.js'}
    }
    return {entry: './build/default.js', filename: `${name}.js`}
}

const common = {
    entry: {
        'observer-integration': buildDetails(libraryName).entry
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: 'ts-loader',
            },
        ],
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
            LIBRARY_VERSION: JSON.stringify(version)
        }),
        new webpack.BannerPlugin({
            banner: readFileSync(path.resolve(__dirname, '../../', 'LICENSE.md'), 'utf8'),
            raw: false
        }),
        new CleanWebpackPlugin({
            dry: true,
            verbose: true
        })
    ],
}

const versionedOutput = {
    output: {
        path: path.resolve(__dirname, '../../', 'dist',`v${version}`),
        filename:  buildDetails(libraryName).filename,
        library: libraryName,
        umdNamedDefine: true,
        libraryExport: "default",
        libraryTarget: "umd"
    },
    ...common
}

const latestOutput = {
    output: {
        path: path.resolve(__dirname, '../../', 'dist',`latest`),
        filename:  buildDetails(libraryName).filename,
        library: libraryName,
        umdNamedDefine: true,
        libraryExport: "default",
        libraryTarget: "umd"
    },
    ...common
}
module.exports = [
    versionedOutput,
    latestOutput
];
