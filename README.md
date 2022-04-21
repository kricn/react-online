# 目录
- [项目初始化](#项目初始化)
- [配置路径别名和antd](#配置路径别名和antd)
- [配置store](#配置store)
- [规划路由](#规划路由)
- [mobx 的使用](#mobx的使用)
- [拖拽](#拖拽)
- [Axios的封装和对请求进行缓存(LRU缓存)](#Axios的封装和对请求进行缓存(LRU缓存))
- [Antd Form 组件常用表单的使用](#Form组件常用表单的使用)
- [虚拟列表](#虚拟列表)
- [关于 useEffect 与 useState 值处理问题](#HOOKS小细节)
- [设计模式](#设计模式)
  - [单例模式](#单例模式)
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
## mobx的使用
1. 安装 mobx, mobx-react
```sh
yarn add mobx mobx-react
```
2. 新建 store 文件夹，管理所有状态 
3. 分文件管理状态，新建 appStore 文件，管理用户状态
```ts
import {observable, action, makeObservable} from 'mobx'
/**
 * observable 装饰器表示定义一个可观察变量
 * action 装饰器表示定义一个修改内部变量的方法
 * get 装饰器定义一个计算属性
 */
interface UserInfo {
  username?: string
}
interface Users {
}
class AppStore {
  constructor() {
    makeObservable(this) // 高版本的 mobx 需要在构造器中加上这句
  }
  @observable isLogin: Boolean = false  //利用cookie来判断用户是否登录，避免刷新页面后登录状态丢失
  @observable users: Users[] = []  //用户数据库
  @observable userInfo: UserInfo = {}  //当前登录用户信息
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
4. 将定义好的 store 注入所有组件中
```ts
// index.tsx
// ...
import { Provider } from 'mobx-react'; 
import store from '@/store'  // 统一的 store 出口

ReactDOM.render(
  <BrowserRouter>
    <Provider {...store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
```
5. 在组件中使用
```tsx
// /src/Login/index.tsx

import { inject, observer } from 'mobx-react'

// import appstore from '@/store/appStore'

function Login({appStore}: any) {
  // 通过导入 appStroe 直接使用
  // 再用 observer 包裹组件
  // ...
}

// 通过 inject 注入 store，store 就会被注入到 props 中
export default inject('appStore')(observer(Login))
```
## 拖拽
浏览器上的元素一般是不允许拖拽移动的，需要给需要拖拽的元素添加属性 draggable 表示该元素可以进行拖拽。拖拽后的元素并不会被复制或移动到放开点，需要在需要放置的点作额外的处理 
```tsx
function Demo () {

  // 在拖拽开始时(拖拽对象被鼠标按下)，通过 e.dataTransfer.setData 记录下当前元素
  // 这里是通过 id 记录
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const ele = e.target as HTMLElement
    e.dataTransfer.setData('DRAG_NODE_ID', ele.id)
  }

  // 在可以放置拖拽对象的区域处理拖拽过来的对象
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const ele = e.target as HTMLElement
    // 禁止默认时间
    e.preventDefault();
    // 从刚才保存的数据中拿到数据
    var data = e.dataTransfer.getData('DRAG_NODE_ID');
    // 将对象节点插入到当前的元素下
    ele.appendChild(document.getElementById(data) as HTMLElement);
  }

  return (
    <>
      <div onDrop={handleDrop}  onDragOver={e => e.preventDefault()}>
        <div className={style.box} id="dragger" onDragStart={handleDragStart} draggable>拖拽元素</div>
        <div className={style.drop} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>放置区域</div>
      </div>
    </>
  )

}
```
### [拖拽列表](/src/views/Dragger/index.tsx) 
列表的拖动不需要使用dataTransfer.getData & dataTransfer.setData，只需要通过改变数组列表中元素的位置即可 
- onDragStart 获取需要拖拽的目标 a
- onDragOver 获取放置的目标 b
- 交换 a b在列表中的位置
## Axios的封装和对请求进行缓存(LRU缓存)
### Axios 的封装
```js
import qs from 'qs';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseBody } from '@/types';
const Service = axios.create({
  baseURL: '',
  timeout: 30 * 1000
})
//拦截器
//请求拦截
Service.interceptors.request.use(config => {
	return config
}, error => {
	return Promise.reject(error)
});
// 扩展原来的AxiosResponse
// 这样可以在响应 response.config 中拿到自己的自定义的传参
interface AxiosResponseExtend extends AxiosResponse<ResponseBody, any> {
  config: AxiosRequestConfig & RequestOptions
}
// 响应拦截
Service.interceptors.response.use(((response: AxiosResponseExtend) => {
	const data = response.data
	return data
  // 此处需要断言为 any，不然自定义不了类型
}) as any, error => {
  // 构建接口错误返回结构
	return {
    code: -1,
    msg: `${error}`,
    data: null
  }
});

interface RequestOptions {
  headers?: any
  isCache?: boolean
}
type Method = 'GET' | 'POST' | 'DELETE' | 'PUT'
// 这里返回一个 Promise 而不是一个 AxiosPromise
const request = (method: Method, path: string, params?: any, data?: any, options?: RequestOptions):Promise<any> => {
  return Service({
    method,
    url: path,
    params,
    data,
    headers: options?.headers,
    ...options,
  })
}
export default request
```
### 对请求做缓存
- 场景
列表页面有许多筛选项的时候，可以对其进行缓存，但并不是每个筛选项都要做缓存，我们只对高频率的筛选项做缓存（[LRU算法](/src//utils//LRUCache.ts)），用空间换时间。
- [封装请求](/src/utils/request.ts)
## Form组件常用表单的使用
[参考文件](/src/views/User/index.tsx) 
**注意点** 
- 被 Form 下 Form.Item 包裹的子元素中的 value 属性会被 Form 组件代理，隔一层则无效，通过 Form.Item 中的 valuePropName 更改默认代理属性
```tsx
<Form>
  // 有效代理
  <Form.Item>
    <Input >
  </Form.Item>
  // 无效代理
  <Form.Item>
    <Input >
  </Form.Item>
</Form>
```
- 被 Form 代理后的 Input 组件处罚 change 事件后，回调函数的第一个将不再是 Input 中 value 的值，需要在回调中通过 form.getFieldValue('name') 获取
- 使用 Form 代理 Upload 组件，需要设置代理属性为 fileList，再添加 getValueFromEvent 提取 出 fileList。之后通过后 form.getFieldValue('file') 获取的就是整个 fileList 的对象 [Upload参考](https://ant.design/components/upload-cn/)
```tsx
// 通过 form.getFieldValue('cover') 可以获得已经上传的 fileList
// 给 Upload 自定义 fileList 属性可以不接受 Form 的代理
// 但这样需要自行处理 onChange 事件

<Form.Item
  name="cover"
  label="封面列表"
  valuePropName="fileList"  // 设置代理属性
  getValueFromEvent={normFile} // 提取filelist，没有该属性上传时会报错
>
  <Upload
    name="cover"
    listType="picture-card"
    action=""
    beforeUpload={(file: File) => beforeImageUpload(file, 8)}
    onChange={() => null} // onChange 可以不用设置，会自动代理，只需要再提交的时候格式化一下格式即可
  >
    // ...
  </Upload>
</Form.Item>
```
## 虚拟列表
### 布局
- 确定容器的大小，即最外层的高度
- 有一个列表容器，用来放全部数据的
- 再嵌套一层视口容器，用来显示数据的的，相当于一个窗口在列表容器上滑动
- 最后只渲染在视口容器内的数据即可
```tsx
function VirtualList() {
  // ...others
  return (
    <>
      <div> {/*外层容器*/}
        <div> {/*列表容器，高度是全部数据的高度*/}
          <div> {/* 视口容器，只渲染部分数据，通过 transform 去配合滚动显示数据 */}
          {/*视口容器没有动画的话，只数据变换过快时会发生闪烁*/}
            {renderListItem()}
          </div>
        </div>
      </div>
    </>
  )
}
```
### 需要的变量/依赖
- list 数组列表
- positionCache 数组缓存列表，会记录 list 数组元素渲染后的高度等信息
- listHeight 基于 list 列表的总高度，这样才能出现滚动条
- startIndex 截取 list 数组元素的开始下标
- limit 容器剩下还能放下多少个元素
- endIndex 元素结束下标
### 思路
- 在 list 请求完后对 positionCache 进行初始化默认的高度和bottom
```tsx
// ... 其他代码
useEffect(() => {
  const positList: PostionCacheItem[] = [];
  list.forEach((item, i) => {
    positList[i] = {
      ...item,
      index: i,
      height: defaultItemHeight,
      bottom: (i + 1) * defaultItemHeight,
    }
  })
  setPositionCache(positList)
}, [list])
```
- 当 startIndex 改变或 positionCache 有更新时，需要重新更新 positionCache 里部分信息（如果需要的话）
```tsx
useEffect(() => {
  const nodeList = ViewRef?.current?.childNodes as NodeListOf<HTMLDivElement>;
  const positList = [...positionCache]
  let needUpdate = false;
  nodeList?.forEach(node => {
    // ...计算逻辑
  })
  // eslint-disable-next-line
}, [startIndex, ViewRef, positionCache])
```
- 更新 positionCache 信息后触发 list 高度的计算，limit 数量的计算，及 endIndex 的计算
- 定义滚动事件，在滚动时，根据容器的 scrollTop 去计算 startIndex 的值，这样依赖 startIndex 的值会得到更新
```tsx
// 列表滚动时
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement, UIEvent> | Event) => {
    if (e.target !== ContainerRef.current) return;
    const ele = e.target as HTMLDivElement
    const scrollTop = ele.scrollTop;
    // 这里通过二分法查找 startIndex
    const currentStartIndex = getStartIndex(scrollTop);
    if (currentStartIndex !== startIndex) {
      setStartIndex(currentStartIndex);
    }
    // eslint-disable-next-line
  }, [ContainerRef, startIndex, positionCache])
```
- [参考文件](/src/views/VirtualList/index.tsx)
## HOOKS小细节
### 问题点
1、useEffect 产生的闭包问题，拿不到 useState 中已经改变的值？ 
2、在 useEffect 中监听事件(一些会频繁触发的事件)，添加依赖数组会导致事件不断的监听和卸载，如何优化？ 
3、监听事件的回调函数不能获取 useState 中(包括 useMemo 和 useCallback)已经改变的值该如何解决？ 
......... 
- useEffect 默认会在每次 render 时执行一次（如果没有第二个参数的话），此时若在其中有定时器啥的，就会创建很多定时器，尽管有在卸载时清除定时器，但频繁的创建和销毁会造成资源的消耗

- useEffect 执行时会产生一个闭包的作用域，即在执行时，作用域里的变量是什么值，之后就是什么值，所以 useEffect 可以值入一个依赖数组，在依赖数组中的值发生变化后，更新 useEffect 中的作用域得到最新的值，传入一个空数组，则表示在第一次渲染时执行一次(1)

- useEffect 中想监听一些事件时，但传入一个空的依赖数组在初始化时监听，显然这时 useEffect 已经产生了闭包，在之后事件的回调中的值一直都是闭包里的值，不会以最新值去执行。解决方法是额外创建一个新的 ref 变量，用 ref 变量去记录更改的值，ref 是可以保留最新值的，不会因为多次渲染而丢失值(2,3)
- [参考瀑布流的实现](/src/views/Layout/Fall/index.tsx)
```tsx
function App () {
  const [conut, setCount] = useEfect<number>(0);
  /** 创建useRef额外便令 */
  /** 
   * const CountRef = useRef<number>(0); 
   * // 这样 CountRef 就会记录 count 的最新值，在函数里任何地方都能获取到 count 的最新值
   * CountRef.current = count
   * */

  const handleClick = () => {
    /** 使用 ref 优化
     * 在事件初始化时创建一次监听就够了
     * console.log(CountRef.current)
     */
    /** 优化时注释掉 */
    console.log(count)
  }

  useEffect(() => {
    const timer => setInterval(() => {
      setCount(v => v + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])  // 这里如果没有依赖数组，定时器会在视图更新时创建，在下一次试图更新前销毁

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, []) // 同理，这时有空的依赖数组，则默认只在初始化的时候进行一次监听
  // 当 count 的值改变后，点击网页，打印的值还是 0
  // 若添加了 count 到依赖数组中，则每次 count 改变，useEffect 中就会每次移除事件的监听并生成新的作用域之后再次监听相同的事件 

  return {
    <div>{count}</div>
  }
}
```
## 设计模式
### 单例模式


