# 目录
- [项目初始化](#项目初始化)
- [配置路径别名和antd](#配置路径别名和antd)
- [配置store](#配置store)
- [规划路由](#规划路由)
## 项目初始化 {#init}
通过命令 npx create-react-app my-app --template typescript 创建项目  
安装 craro，这样可以不暴露出 webpack 那些配置  
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
## 配置路径别名和antd
1、yarn add antd 安装 ant design 框架  
2、新建 craco.config.js 文件
```js
// craco.config.js
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
      ['import', { libraryName: 'antd', style: true, libraryDirectory: 'es' }] // 配置antd 按需引入
    ]
  }
}
```
3、在 App.css 中引入 antd 的样式
```css
@import '~antd/dist/antd.css';
```
## 配置store
状态管理插件用的是 mobx  
1、yarn add mobx react-mobx 安装依赖  
2、新建 store 文件夹，以 index 为入口导出所有的 store  
3、创建 store 文件，如 appStore.ts
```ts

import {observable, action, makeObservable} from 'mobx'
interface UserInfo {
  username?: string
}

interface Users {

}

class AppStore {
  constructor() {
    makeObservable(this) // 新版本的 mobx 需要在类中添加这行代码
  }
  // 定义观察变量
  @observable isLogin: Boolean = false  //利用cookie来判断用户是否登录，避免刷新页面后登录状态丢失
  @observable users: Users[] = []  //用户数据库
  @observable userInfo: UserInfo = {}  //当前登录用户信息

  // 定义更新变量的方法
  // 切换用户状态
  @action toggleLogin(flag: boolean, info={}) {
    this.userInfo = info  //设置登录用户信息
    if (flag) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  }
}
export default new AppStore()
```
4、在 index.tsx 中引入，通过注入的方式共享到所有地方
```tsx
// ...
import { Provider } from 'mobx-react'; 
import store from '@/store'

ReactDOM.render(
  <BrowserRouter>
    <Provider {...store}>  {/* 添加 */}
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
```
5、在函数组件中，通过函数包裹方式使组件能响应数据的变化，在类组件中则用装饰器的方法
```tsx
// /src/components/RouterGuard/index.tsx
// ...
import { inject, observer } from 'mobx-react'
import { useEffect } from 'react'
import { getToken } from '@/utils'
// 用函数包裹后，hooks 中的参数 props 就会被添加上 store 的名称
function RouteView ( {appStore}: any) {
  const [loading, setLoading] = useState(true)

  // 判断是否已经登录过
  useEffect(() => {
    getToken() ? appStore.toggleLogin(true, {username: getToken()}) : appStore.toggleLogin(false)
    setLoading(false)
  }, [loading, appStore])
}
// 通过函数包裹形式使组件能响应数据变化
export default inject("appStore")(observer(RouteView));
```
## 规划路由
规划路由接口，之后通过路由标志位来判断用户是否有权限访问路由  
规划路由的思路是递归路由去过滤掉需要权限但是用户权限不足的路由，生成新的路由数组再去渲染。  
1、定义路由守卫组件，之后凡是用户信息改变则重新生成新的路由数组后再渲染路由
```js
// /src/components/RouterGuard 路由守卫
// 在 App.tsx 中使用
import RouteView from '@/components/RouterGuard';
import './App.css';
function App() {
  return <RouteView />
}
export default App

```
2、创建整体布局layout，react-router v6 版本通过 Outlet 组件进行路由占位。之后所有子路由都基于layout作单页面的跳转  
~~3、通过递归的方式渲染子路由，在递归过程中，需要对传入的路由数组作一次深拷贝，不然会导致第一次过滤掉没有权限的路由，下一次有权限了这个路由会丢失~~  
3、通过鉴权判断当前此路由是否有权限，给路由打上标记，在渲染路由时，通过标记判断此路由是否需要被渲染出来
```ts
// /src/components/help.ts
const generateRoute:any = (routes:Array<RouteInterface>, isLogin: boolean = false, userInfo: any = {}) => {
  return routes.map(item => {
    if (item?.children?.length) item.children = generateRoute(item.children, isLogin, userInfo)
    if (!item.meta) item.meta = {}
    // 隐藏需要登录的路由
    if (item.meta?.auth && !isLogin) {
      item.meta.hidden = true  // 隐藏路由但是可以渲染
      item.meta.noRender = true // 隐藏并不渲染
    }
    // 放开已有权限的路由
    if (item.meta?.auth && isLogin) {
      item.meta.hidden = false
      item.meta.noRender = false
    }
    // 又隐藏又放开是因为登录状态会出现跳跃的情况
    // 共用一个路由表在登录状态该表后需要再次修改路由的标记
    return item
  })
}
```
## mobx 的使用
