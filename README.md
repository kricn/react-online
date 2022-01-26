## 项目初始化
通过命令 npx create-react-app my-app --template typescript 创建项目\
安装 craro，这样可以不暴露出 webpack 那些配置\
将 package.json 的 "scripts" 改为
```json
"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test"
}
```