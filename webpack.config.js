var webpack = require('webpack');
var path = require('path');
var webpackConfig =  {
  entry: './src/index.ts',
  output: {
    filename: process.env.NODE_ENV === "development" ? 'auto-reconnect-webSocket.js': 'auto-reconnect-webSocket.min.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: './',
    library: 'reconnectWebSocket',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({'process.env': process.env.NODE_ENV === "development" ? {NODE_ENV: '"development"'} : {NODE_ENV: '"production"'}}),
  ]
};
if(process.env.NODE_ENV === "production"){
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  )
}
module.exports = webpackConfig;