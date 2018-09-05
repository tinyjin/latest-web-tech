const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

module.exports = {
  entry: {
    main: './scripts/index.js'
  },
  output: {
    filename: 'bundle.[name].js',
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './pages/index.html',
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'scripts/sw.js'),
      includes: ['**/*', '**/*.png'],
    }),
    new ManifestPlugin({
      fileName: 'manifest.json',
      basePath: '/',
      seed: {
        name: 'My Manifest',
        short_name: "Learning PWA",
        icons: [
          {
            src: 'main-icon.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ],
        start_url: './index.html',
        background_color: '#2196F3',
        display: 'standalone',
        theme_color: '#2196F3'
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }, {
        test: /\.(png|woff|woff2|eot|ttf|svg|main-icon\.png)$/,
        loader: 'file-loader',
        options: {
          publicPath: './icon/',
          outputPath: './',
          name: '[name].[ext]?[hash]'
        }
      }, {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        exclude: /main-icon\.png/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]?[hash]',
            publicPath: './',
            limit: 10000
          }
        }
      }, {

      }
    ]
  },
  devtool: 'source-map',
  mode: 'development', // If release , change mode to 'production'
  devServer: {
    contentBase: './'
  }
};