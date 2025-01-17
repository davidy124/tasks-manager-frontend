const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 3002,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8084',
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: 'keep-alive'
        }
      }
    }
  }
});
