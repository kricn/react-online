import {  LazyExoticComponent } from 'React'

interface MetaInterface {
  title?: string  // 路由标题
  hidden?: boolean // 是否在菜单栏中隐藏
  icon?: any // 菜单icon
  auth?: boolean // 是否需要权限
  noRender?: boolean // 是否不渲染这个路由
}

export interface RouteInterface {
  path: string // 路由路径
  index?: boolean // 是否是默认路由
  to?: string  // 重定向路径，需要引入 /components/Redirect 组件
  component?: LazyExoticComponent<() => JSX.Element> | JSX.Element | any // 懒加载组件
  children?: Array<RouteInterface> // 子路由
  meta?:  MetaInterface // 其他路由信息
}