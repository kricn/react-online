import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';

import LazyLoading from '@/components/UnitComponent/LazyLoading';

import routers from '@/router/index'
import { RouteInterface } from '@/types/router'
import { generateRoute } from './helper'
import { inject, observer } from 'mobx-react';

// 渲染路由对应的组件
const renderElement = (route:RouteInterface):any => {
  return (
    <Suspense fallback={<LazyLoading />}>
      <route.component {...route} />
    </Suspense>
  )
}

// 只渲染对应的Route,外层需要用Routes包裹
const renderRoute:any = (routes:Array<RouteInterface>) => {
  return (
    routes.map(item => {
      return (
        !item?.component ? 
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

function AllRoutes ({UserInfo}: any) {

  return (
    (
      <Routes>
        { renderRoute(routers) }
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    )
  )
}

export default inject('UserInfo')(observer(AllRoutes));