const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

var PATHS = {
    entryPoint: path.resolve(__dirname, 'src/index.ts'),
    bundles: path.resolve(__dirname, 'dist'),
}

var config = {
    mode: 'production',
    // These are the entry point of our library. We tell webpack to use
    // the name we assign later, when creating the bundle. We also use
    // the name to filter the second entry point for applying code
    // minification via TerserPlugin
    entry: {
        'truncate-element': [PATHS.entryPoint],
        'truncate-element.min': [PATHS.entryPoint]
    },
    // The output defines how and where we want the bundles. The special
    // value `[name]` in `filename` tell Webpack to use the name we defined above.
    // We target a UMD and name it truncate-element. When including the bundle in the browser
    // it will be accessible at `window['truncate-element']`
    output: {
        path: PATHS.bundles,
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'truncate-element',
        umdNamedDefine: true
    },
    // Add resolve for `ts` files, otherwise Webpack would
    // only look for common JavaScript file extension (.js)
    resolve: {
        extensions: ['.ts', '.js']
    },
    // Activate source maps for the bundles in order to preserve the original
    // source when the user debugs the application
    devtool: 'source-map',
    module: {
        // Webpack doesn't understand TypeScript files and a loader is needed.
        // `node_modules` folder is excluded in order to prevent problems with
        // the library dependencies, as well as `__tests__` folders that
        // contain the tests for the library
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/,
                terserOptions: { sourceMap: true },
            }
            )],
    },
}

module.exports = config;