var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'react-client/dist');
var APP_DIR = path.resolve(__dirname, 'react-client/src');

var config = {
  entry: APP_DIR + '/index.jsx',

  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  externals: {
    "jquery": "jQuery"
  }
};

module.exports = config;