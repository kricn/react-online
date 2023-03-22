import { USER_INFO_NAME } from '@/utils/constance'
import { getToken } from '@/utils/session'
import { inject, observer } from 'mobx-react'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import routers, { whiteRouterList } from '@/router/index'


function RouterGuard(props: {children: any, UserInfo?: any, RouterInfo?: any}) {

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!whiteRouterList.includes(location.pathname)) {
      const token = getToken()
      if (!token && location.pathname !== '/login') {
        navigate('/login', {replace: true})
      }
      if (token) {
        /** 更新用户信息 */
        const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO_NAME) || '{}')
        props.UserInfo.update(userInfo)
        /** 获取路由信息 */
        props.RouterInfo.toggleLoading()
        props.RouterInfo.update(routers)
        new Promise<void>(resolve => setTimeout(() => {
          props.RouterInfo.toggleLoading()
          resolve()
        }, 300))
      }
    }
    
  })
  
  return props.children
}

export default inject('UserInfo', 'RouterInfo')(observer(RouterGuard))
