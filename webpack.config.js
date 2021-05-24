const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
  assets: 'assets/',
}

const PAGES_DIR = `${PATHS.src}/pug/pages`
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith('.pug'))

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: `${PATHS.assets}scripts/[name].js`,
    path: path.resolve(__dirname, PATHS.dist),
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].css`,
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, '.html')}`,
          minify: {
            collapseWhitespace: true,
          },
          title: 'Webpack + Pug template',
          inject: 'body',
        })
    ),
    new CopyWebpackPlugin({
      patterns: [{ from: `${PATHS.src}/assets`, to: '' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    open: true,
  },
}
