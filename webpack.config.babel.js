import path from 'path';
import webpack from 'webpack';

const HtmlWebpackPlugin = require('html-webpack-plugin');

// 源代码的根目录
const srcRootPath = path.join(__dirname, 'src-client');

// 静态资源根目录
const wwwStaticRoot = 'static';

// index.html 模版的根目录
const appHtmlPath = path.join(__dirname, 'public','index.html');

// 编译后的根目录
const distRootPath = path.join(__dirname, 'www', wwwStaticRoot);

export default {
  devtool: 'source-map',
  entry: {
    index: `${srcRootPath}/index.js`,
    vendor: [
      'react',
      'react-dom',
      'classnames',
      'react-router',
    ]
  },
  output: {
    path: `${distRootPath}`,
    filename: 'js/[name].bundle.js', // TODO hash [contenthash:8]
    chunkFilename: 'js/[id].chunk.js',
    publicPath: `/`
  },
  externals: {jquery: "jQuery"},
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      common: `${srcRootPath}/common`,
      admin: `${srcRootPath}/admin`
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        cacheDirectory: true,
        query: {
          presets: ['react', 'es2015-loose', 'stage-0'],
          plugins: ['transform-runtime', 'transform-decorators-legacy', ["import", [{
            "libraryName": "antd",
            "style": "css"
          }]]]
        },
        exclude: /node_modules/
      },
      {
        test: /\.css?$/,
        loader: 'style!css'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'js/common.js'}),
    //new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    new HtmlWebpackPlugin({
      inject: true,
      template: appHtmlPath,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ]
};
