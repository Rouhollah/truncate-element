const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './sample/sample.ts',
    output: {
        filename: './sample.js',
        path: path.resolve(__dirname, 'sample-dist'),
    },
    devServer: {
        liveReload: true,
        open: true,
        hot: true,
        static: {
            directory: path.join(__dirname, 'sample-dist'),
        },
        port: 9000,
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Truncate-Element',
            template: 'sample/index.html',
            filename: 'index.html'
        })
    ]
};