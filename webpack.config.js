const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/truncate-element.ts',
  output: {
    filename: 'truncate-element.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    index: 'index.html',
    port: 9000
  },
  devtool: 'inline-source-map',
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
  }
};