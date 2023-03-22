import { Suspense, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { inject, observer } from 'mobx-react'

import LazyLoading from '@/components/UnitComponent/LazyLoading';

import routers from '@/router/index'
import { RouteInterface } from '@/types/router'
import { generateRoute } from './helper'

import { getToken } from '@/utils/session'
import { getUserInfo } from '@/api/user';
import { useAsyncState } from '../UseAsyncState';

// 渲染路由对应的组件
const renderElement = (route:RouteInterface):any => {
  return (
    // 不支持渲染的，则跳转到对应配置的路径或404
    !route?.meta?.noRender ?
    (
      <Suspense fallback={<LazyLoading />}>
        <route.component {...route} />
      </Suspense>
    ) : <Navigate to={route?.to || '/404'} />
  )
}

// 只渲染对应的Route,外层需要用Routes包裹
const renderRoute:any = (routes:Array<RouteInterface>) => {
  return (
    routes.map(item => {
      return (
        !item.component ? 
          item.children?.length ? renderRoute(item.children) : '' :
          (
            <Route
              {...item}
              key={item.path}
              path={item.path}
              element={
                renderElement(item)
              }
            >
              {/* 嵌套路由 */}
              {item.children?.length ? renderRoute(item.children) : ''}
            </Route>
          )
        )
    })
  )
}

function RouteView ( {UserInfo}: any) {

  const [loading, setLoading] = useAsyncState(true)

  const _getUserInfo = useCallback(async () => {
    setLoading(true)
    const res = await getUserInfo()
    if (res.code === 1) {
      UserInfo.update({...res.data})
    } else {
      UserInfo.update({uuid: 'root', username: 'root'})
    }
    setLoading(false)
    // eslint-disable-next-line
  }, [])

  // 判断是否已经登录过
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return UserInfo.reset()
    }
    const userInfo = getToken('user-info') && JSON.parse(getToken('user-info'))
    if (userInfo.uuid) {
      UserInfo.update({...userInfo, token})
      setLoading(false)
    }
    if (!userInfo.uuid) _getUserInfo()
    // eslint-disable-next-line
  }, [UserInfo.user.uuid])

  return (
    loading ? <LazyLoading /> :
    (
      <Routes>
        { renderRoute(generateRoute(routers, !!UserInfo.user?.token)) }
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    )
  )
}

export default inject("UserInfo")(observer(RouteView));