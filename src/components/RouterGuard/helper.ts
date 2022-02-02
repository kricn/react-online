
import { RouteInterface } from '@/types/router'

const generateRoute:any = (routes:Array<RouteInterface>, isLogin: boolean = false, userInfo: any = {}) => {
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

  return routes.map(item => {
    if (item?.children?.length) item.children = generateRoute(item.children, isLogin, userInfo)
    if (!item.meta) item.meta = {}
    // 隐藏需要登录的路由
    if (item.meta?.auth && !isLogin) {
      item.meta.hidden = true
      item.meta.noRender = true
    }
    // 放开已有权限的路由
    if (item.meta?.auth && isLogin) {
      item.meta.hidden = false
      item.meta.noRender = false
    }
    return item
  })
}

export {
  generateRoute
}