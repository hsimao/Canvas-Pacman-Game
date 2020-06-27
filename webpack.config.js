const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, './src'),
  entry: {
    index: 'index.js',
  },
  output: {
    // 預設output資料夾 ./dist ,也可自訂path修改如下
    path: path.resolve(__dirname, './docs'),
    filename: './js/[name].js?[hash:8]',
  },
  // 簡化引入路徑設定
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('src/js'),
      path.resolve('src/scss'),
      path.resolve('src/images'),
      path.resolve('node_modules'),
    ],
    extensions: ['.js'], // 引入時副檔名.js可省略不寫
  },
  devServer: {
    compress: true,
    port: 3000,
    stats: {
      assets: true,
      cached: false,
      chunkModules: false,
      chunkOrigins: false,
      chunks: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: false,
      source: false,
      version: false,
      warnings: false,
    },
  },
  /*
  optimization 優化開發時的編譯速度
  將node_modules插件檔案與自己寫的檔案拆分
  開發時就不會全部檔案都重新編譯，只會重新編譯有更改的檔案
  更多優化設定：https://webpack.docschina.org/configuration/optimization/
  */
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        include: path.resolve(__dirname, './src/assets'),
        exclude: path.resolve(__dirname, './node_modules'),
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]?[hash:8]',
        },
      },
      // css loader
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './src/css'),
        exclude: path.resolve(__dirname, './node_modules'),
        loader: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, './src/scss'),
        exclude: path.resolve(__dirname, './node_modules'),
        loader: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // babel 編譯
      {
        test: /\.js$/,
        // 目標範圍: js編譯必須為全部,可以設定 '.'根目錄
        include: path.resolve(__dirname, '.'),
        use: 'babel-loader',
      },
      /*
        圖片優化1 壓縮圖片 image-webpack-loader
        圖片優化2 url-loader
        1.) 將小圖檔轉譯為64base格式，減少http請求，降低server負擔
        2.) 圖片檔名加入hash更新快取
      */
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        include: path.resolve(__dirname, './src/images'),
        exclude: path.resolve(__dirname, './node_modules'),
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 檔案大小超過8k的圖片不轉譯，只更新以下檔名，加入hash更新快取
              name: '[path][name].[ext]?[hash:8]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // css
    new MiniCssExtractPlugin({}),
    // 對應html/資料夾內的樣板產出對應html
    new HtmlWebpackPlugin({
      title: 'Canvas 小精靈',
      filename: 'index.html',
      template: 'html/index.html',
      chunks: ['vendor', 'index'],
    }),
  ],
}
