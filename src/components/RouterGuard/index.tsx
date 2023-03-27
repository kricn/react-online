import { USER_INFO_NAME } from '@/utils/constance'
import { getToken } from '@/utils/session'
import { inject, observer } from 'mobx-react'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import routers, { whiteRouterList } from '@/router/index'
import LazyLoading from '../UnitComponent/LazyLoading'


function RouterGuard(props: {children: any, UserInfo?: any, RouterInfo?: any}) {

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (getToken()) {
      /** 更新用户信息 */
      const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO_NAME) || '{}')
      props.UserInfo.update(userInfo)
    }
    // 不是白名单里的路由，默认全部都要登录
    const token = getToken()
    if (!token && location.pathname !== '/login') {
      navigate('/login', {replace: true})
    }
  }, [])

  // 在白名单里的路由，直接跳过
  if (whiteRouterList.includes(location.pathname)) {
    return props.children
  }
  
  const token = getToken()
  // 没有路由信息就获取路由信息
  if (token && !props.RouterInfo.routers.length) {
    props.RouterInfo.update(routers)
  }

  return props.RouterInfo.loading ? <LazyLoading /> : props.children
}

export default inject('UserInfo', 'RouterInfo')(observer(RouterGuard))
