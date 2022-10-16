const path = require('path');
module.exports = {
    mode: 'production',
    entry: './src/truncate-element.ts',
    output: {
        filename: 'truncate-element.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

};