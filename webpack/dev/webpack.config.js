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
    }
    return {entry: './build/default.js', filename: `${name}.js`}
}



module.exports = {
    entry: {
        'observer-integration': buildDetails(libraryName).entry
    },
    output: {
        path: path.resolve(__dirname, '../../', 'dist',`v${version}`),
        filename:  buildDetails(libraryName).filename,
        library: libraryName,
        umdNamedDefine: true,
        libraryExport: "default",
        libraryTarget: "umd"
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
};
