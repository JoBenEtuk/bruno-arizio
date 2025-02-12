const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'

module.exports = {
  entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],

  resolve: {
    modules: [dirApp, dirAssets, dirNode],
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    new webpack.ProvidePlugin({}),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: '',
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },

      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|webp)(\?.*$|$)/i,
        type: 'asset',
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/,
      },
    ],
  },
}
