const path = require('path')

const pathResolve = pathUrl => path.join(__dirname, pathUrl)

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
    }
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