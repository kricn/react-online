import { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';
import { inject, observer } from 'mobx-react'

import LazyLoading from '@/components/UnitComponent/LazyLoading';

import routers from '@/router/index'
import { RouteInterface } from '@/types/router'
import { generateRoute } from './helper'
// import { useAsyncState } from '../UseAsyncState';


function RouteView ( {appStore}: any) {

  const navigate = useNavigate()

  useEffect(() => {
    !appStore.isLogin && navigate('/login')
  }, [appStore.isLogin, navigate])

  // 渲染路由对应的组件
  const renderElement:any = (route:RouteInterface) => {
    return (
      (
        <Suspense fallback={<LazyLoading />}>
          <route.component {...route} />
        </Suspense>
      ) 
    )
  }

  // 只渲染对应的Route,外层需要用Routes包裹
  const renderRoute:any = (routes:Array<RouteInterface>) => {
    return (
      routes.map(item => {
        return (
          !item?.meta?.hidden ?
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
          </Route> : ''
        )
      })
    )
  }

  return (
    <Routes>
      {
        renderRoute(generateRoute(routers, appStore.isLogin))
      }
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  )
}

export default inject("appStore")(observer(RouteView));