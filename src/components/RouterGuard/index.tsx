import { Suspense } from 'react';
import { Routes, Route } from 'react-router';

import LazyLoading from '@/components/UnitComponent/LazyLoading';

import routers from '@/router/index'
import { RouteInterface } from '@/types/router'

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
            <Suspense fallback={<LazyLoading />}>
              <item.component />
            </Suspense>
          }
        >
          {/* 嵌套路由 */}
          {item.children?.length ? renderRoute(item.children) : ''}
        </Route>
      )
    })
  )
}

function RouteView () {
  return (
    <Routes>
      {
        renderRoute(routers)
      }
    </Routes>
  )
}

export default RouteView;