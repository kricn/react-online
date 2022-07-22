const path = require('path')

const pathResolve = pathUrl => path.join(__dirname, pathUrl)

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const getProxy = (path = '') => {
  return {
    target: path || 'http://localhost:1010',
    changeOrigin: true,
    pathRewrite: {
      "^/api": ''
    }
  }
}

module.exports = {
  webpack: {
    alias: {
      '@': pathResolve('src'), // 配置@ （同时还要配置tsconfig，如下）
    },
    /** [分离第三方包](https://zhuanlan.zhihu.com/p/152097785) */
    configure: (webpackConfig, { env, paths }) =>{
      webpackConfig.devtool = false;
      webpackConfig.optimization= {
        splitChunks: {
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 6,
          maxInitialRequests: 4,
          automaticNameDelimiter: '~',
          cacheGroups: {
            vendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'all',
            },
            antd: {
              name: `antd`,
              test: /[\\/]antd[\\/]/,
              priority: 0,
              chunks: 'all'
            },
            components: {
              name: `components`,
              test: /[\\/]components[\\/]/,
              priority: 0,
            }
          }
        }
      }
      return webpackConfig
    },
    plugins:[
      new BundleAnalyzerPlugin()
    ],
  },
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', style: true, libraryDirectory: 'es' }]
    ]
  },
  devServer: {
    proxy: {
      '/api':getProxy()
    }
  }
}