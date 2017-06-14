import path from 'path';
import webpack from 'webpack';

// 源代码的根目录
const srcRootPath = path.join(__dirname, 'src-client');

// 静态资源根目录
const wwwStaticRoot = 'static';

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
    path: `${distRootPath}/js`,
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: `/${wwwStaticRoot}/js/`
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
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'common.js'}),
    //new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
  ]
};
