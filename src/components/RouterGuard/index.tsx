import { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { inject, observer } from 'mobx-react'

import LazyLoading from '@/components/UnitComponent/LazyLoading';

import routers from '@/router/index'
import { RouteInterface } from '@/types/router'
import { generateRoute } from './helper'

import { getToken } from '@/utils/session'


function RouteView ( {appStore}: any) {

  const [loading, setLoading] = useState(true)

  // 判断是否已经登录过
  useEffect(() => {
    getToken() ? appStore.toggleLogin(true, {username: getToken()}) : appStore.toggleLogin(false)
    setLoading(false)
  }, [loading, appStore])

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
      })
    )
  }

  return (
    loading ? <LazyLoading /> :
    (
      <Routes>
        { renderRoute(generateRoute(routers, appStore.isLogin)) }
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    )
  )
}

export default inject("appStore")(observer(RouteView));