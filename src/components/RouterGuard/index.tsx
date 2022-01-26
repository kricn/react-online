import { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { inject, observer } from 'mobx-react'

import LazyLoading from '@/components/UnitComponent/LazyLoading';

import routers from '@/router/index'
import { RouteInterface } from '@/types/router'
import { deepCopy } from '@/utils';
// import { useAsyncState } from '../UseAsyncState';


const generateRoute:any = (routes:Array<RouteInterface>, isLogin: boolean = false, userInfo: any = {}) => {
  const temp: Array<RouteInterface> = deepCopy(routes)
  return temp.filter(item => {
    if (item.children?.length) item.children = generateRoute(item.children, isLogin)
    const { meta } = item
    return meta?.auth && !isLogin ? false : true
  })
}

function RouteView ( {appStore}: any) {

  const [isLogin, setIsLogin] = useState(appStore.isLogin)

  useEffect(() => {
    setIsLogin(appStore.isLogin)
    console.log(isLogin)
  }, [appStore.isLogin, isLogin])

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
    <Routes>
      {
        renderRoute(generateRoute(routers, isLogin))
      }
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default inject("appStore")(observer(RouteView));