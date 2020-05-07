const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = env => {
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

  if (process.env.NODE_ENV === 'production') {
    const envKeys = Object.keys(process.env).reduce((agg, property) => {
      agg[`process.env.${property}`] = JSON.stringify(process.env[property])
      return agg
    }, {})

    plugins.push(new webpack.DefinePlugin(envKeys))
  }

  return {
    mode: 'development',
    entry: {
      app: './src/index.tsx'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader'
          }
        },
        {
          enforce: 'pre',
          test: /\.(js|jsx)$/,
          loader: 'source-map-loader'
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
    // externals: {
    //   react: 'React',
    //   'react-dom': 'ReactDOM'
    // }
  }
}
