
import { RouteInterface } from '@/types/router'

import { deepCopy } from '@/utils';

const generateRoute:any = (routes:Array<RouteInterface>, isLogin: boolean = false, userInfo: any = {}) => {
  const temp: Array<RouteInterface> = deepCopy(routes)
  return temp.filter(item => {
    if (item.children?.length) item.children = generateRoute(item.children, isLogin)
    const { meta } = item
    return meta?.auth && !isLogin ? false : true
  })
}

export {
  generateRoute
}