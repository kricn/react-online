
import { RouteInterface } from '@/types/router'
import { getToken } from '@/utils/session'

export const generateRoute = (routes:Array<RouteInterface>): Array<RouteInterface> => {
  // 深拷贝一次路由数组
  // 不然在压栈过程中会丢失原来的路由子项
  // const temp: Array<RouteInterface> = deepCopy(routes)
  // return routes.filter(item => {
  //   // 压栈
  //   if (item.children?.length) item.children = generateRoute(item.children, isLogin)
  //   const { meta } = item
  //   return meta?.auth && !isLogin ? false : true
  // })
  /**
   * 深拷贝后，会导致子路由跳转时，父路由的组件没有更新也会被重新渲染，这样就会导致组件的状态被重置
   */
  const isLogin = getToken()
  return routes.map(item => {
    if (((!isLogin && !item.meta?.auth )|| isLogin) && item?.children?.length) {
      item.children = generateRoute(item.children)
    }
    if (!item.meta) item.meta = {}
    // 免登录路由
    if (!isLogin && !item.meta.auth) {
      return item
    }
    // 登录过后，返回所有路由
    if (isLogin) {
      return item
    }
    return undefined
  }).filter(Boolean) as Array<RouteInterface>
}