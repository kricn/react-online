
import { RouteInterface } from '@/types/router'

import { deepCopy } from '@/utils';

const generateRoute:any = (routes:Array<RouteInterface>, isLogin: boolean = false, userInfo: any = {}) => {
  // 深拷贝一次路由数组
  // 不然在压栈过程中会丢失原来的路由子项
  const temp: Array<RouteInterface> = deepCopy(routes)
  return temp.filter(item => {
    // 压栈
    if (item.children?.length) item.children = generateRoute(item.children, isLogin)
    const { meta } = item
    return meta?.auth && !isLogin ? false : true
  })
}

export {
  generateRoute
}