import { getToken } from '@/utils/session'
import { inject, observer } from 'mobx-react'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'



function RouterGuard(props: {children: any, UserInfo?: any}) {

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = getToken()
    if (!token && location.pathname !== '/login') {
      navigate('/login', {replace: true})
    }
    if (token) {
      const userInfo = JSON.parse(sessionStorage.getItem('user-info') || '{}')
      props.UserInfo.update(userInfo)
    }
    // eslint-disable-next-line
  }, [])
  
  
  return props.children
}

export default inject('UserInfo')(observer(RouterGuard))
