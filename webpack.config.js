const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动添加js、css、favicon等依赖到新生成的html中
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //为了避免打包生成的带有hash名字的文件冗余，在每次打包生成文件之前先清楚当前目录下的文件
// class MyPlugin {
//   // 构造函数
//   constructor(options) {
//     console.log("MyPlugin", options);
//   }
//   // 应用函数
//   apply(compiler) {
//     // 绑定钩子事件
//     compiler.plugin("done", compilation => {
//       console.log(compilation);
//     });
//   }
// }
module.exports = {
  mode: 'development',
  entry: __dirname + '/client/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: ''
  },
  //解析
  resolve: {
    extensions: ['.js', '.jsx'], // 自动解析确定的扩展
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader', 
          'css-loader',
        ],
      },{
        test: /\.less$/,
        loaders: [
          'style-loader', 
          'css-loader',
          {
            loader:'less-loader?sourceMap=true',
            options:{
              modifyVars: {
                'primary-color': 'rgb(106, 72, 196)',
                'link-color': 'rgb(106, 72, 196)',
                'border-radius-base': '2px',
              },
              javascriptEnabled: true
            },
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
            'url-loader'
        ]
      },
      {
        test: /.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', ['@babel/preset-env', {
            targets: {
              browsers: ['last 2 versions']
            }
          }]],
          plugins: [
            '@babel/plugin-transform-runtime',
            ['import',{
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: true
            }]
          ]
        }
      }
    ]
  },
  plugins: [
    // // new CleanWebpackPlugin(['./dist']),
    // new MiniCssExtractPlugin({
    //   filename:"styles/[name].[hash:5].css",
    //   chunkFilename:"styles/[id].[hash:5].css"
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + `/public/index.html`
    }),//自动添加js、css、favicon等依赖到新生成的html中
    new webpack.HotModuleReplacementPlugin(), //热加载插件
    new CleanWebpackPlugin(),
    // new MyPlugin()
  ]
};
