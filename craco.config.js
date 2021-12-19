const path = require('path')

const pathResolve = pathUrl => path.join(__dirname, pathUrl)

module.exports = {
  webpack: {
    alias: {
      '@': pathResolve('src'), // 配置@ （同时还要配置tsconfig，如下）
    }
  },
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', style: true }]
    ]
  },
  plugins: []
}