const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = (env) => {
  const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.local.html'
    })
  ]

  if (!env || env.NODE_ENV === 'dev') {
    const dotenv = new Dotenv({ path: './.env.dev' })
    plugins.push(dotenv)
  }

  if (env.NODE_ENV === 'production') {
    const envKeys = Object.keys(env).reduce((agg, property) => {
      agg[`process.env.${property}`] = JSON.stringify(env[property])
      return agg
    }, {})

    plugins.push(new webpack.DefinePlugin(envKeys))
  }

  return {
    mode: 'development',
    entry: {
      app: './src/index.js'
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'build')
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'build')
    }
  }
}
