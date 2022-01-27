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
调整 tsconfig.json, 在 compilerOptions 中添加 "experimentalDecorators": true，可以取消装饰器类型的警告，添加如下配置
```json
"include": [
  "src",  // 文件检测
  "types" // 自定义的一些类型文件夹
],
"exclude": [  // 排除文件夹
  "node_modules",
  "dist",
  "build"
],
"extends": "./tsconfig.extend.json" // ts 配置拓展，会合并和tsconfig.json中
```
## 规划路由
规划路由接口，之后通过路由标志位来判断用户是否有权限访问路由\
规划路由的思路是递归路由去过滤掉需要权限但是用户权限不足的路由，生成新的路由数组再去渲染。
1、定义路由守卫组件，之后凡是用户信息改变则重新生成新的路由数组后再渲染路由
2、创建整体布局layout，react-router v6 版本通过 Outlet 组件进行路由占位。之后所有子路由都基于layout作单页面的跳转
3、通过递归的方式渲染子路由，在递归过程中，需要对传入的路由数组作一次深拷贝，不然会导致第一次过滤掉没有权限的路由，下一次有权限了这个路由会丢失