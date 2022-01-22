const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

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
  plugins: [
    new CleanPlugin.CleanWebpackPlugin()
  ]
};