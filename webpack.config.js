'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const _ = require('lodash');

const cwd = process.cwd();

module.exports = function (env) {
  const config = {
    context: cwd,
    entry: {
      options: path.join(__dirname, 'src', 'options', 'index.jsx'),
      popup: path.join(__dirname, 'src', 'popup', 'index.jsx')
    },
    output: {
      path: path.join(__dirname, 'kouka-bookmark', 'build'),
      publicPath: 'build',
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        components: path.join(__dirname, 'src/components'),
        utils: path.join(__dirname, 'src/utils')
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            use: ['css-loader', 'sass-loader']
          })
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            use: ['css-loader']
          })
        },
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract({
            use: ['css-loader', 'less-loader']
          })
        }
      ],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-redux': 'ReactRedux',
      'redux-thunk': 'var window.ReduxThunk.default',
      '@alife/aisc': 'var Aisc',
      redux: 'Redux',
      antd: 'var antd',
      moment: 'moment',
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].bundle.css',
        allChunks: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: 2
      }),
      // 进度插件
      new webpack.ProgressPlugin((percentage, msg) => {
        const stream = process.stderr;
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0);
          stream.write(`🐸 building...   ${~~(percentage * 100)}%`);
          stream.clearLine(1);
        } else {
          stream.cursorTo(0);
          stream.write(`🐸 ${msg}   ${~~(percentage * 100)}%`);
          stream.clearLine(1);
        }
      }),
      new BrowserSyncPlugin({
        host: '127.0.0.1',
        port: 4002,
        proxy: 'http://127.0.0.1:4001/'
      })
    ]
  };

  if (env.production) {
    config.plugins.push(
      new UglifyJsPlugin({
        sourceMap: true,
        // beautify: true // 控制是否压缩
      })
    );
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        },
        __DEV__: JSON.stringify('false')
      })
    );
  } else {
    config.devServer = {
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
    config.plugins.push(new webpack.SourceMapDevToolPlugin({}));
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        },
        __DEV__: JSON.stringify('true')
      })
    );
    config.plugins.push(new WebpackNotifierPlugin({
      title: 'Kouka building...',
      alwaysNotify: false,
      excludeWarning: true
    }));
  };
  return config;
};
