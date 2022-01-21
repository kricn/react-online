import {  LazyExoticComponent } from 'React'

export interface RouteInterface {
  path: string // 路由路径
  index?: boolean // 是否是默认路由
  to?: string  // 重定向路径，需要引入 /components/Redirect 组件
  component?: LazyExoticComponent<() => JSX.Element> | JSX.Element | any // 懒加载组件
  children?: Array<RouteInterface> // 子路由
  meta?: any // 其他路由信息
}