import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';

import LazyLoading from '@/components/UnitComponent/LazyLoading';

import routers from '@/router/index'
import { generateRoute } from './helper'
import { RouteInterface } from '@/types/router'

const generateElement:any = (route:RouteInterface) => {
  return (
    !route.redeact ?
    (
      <Suspense fallback={<LazyLoading />}>
        <route.component />
      </Suspense>
    ) : 
    (
      // <Navigate to={route.redeact} />
      <>...</>
    )
  )
}

let auth = false

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
            generateElement(item)
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
        renderRoute(generateRoute(routers))
      }
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  )
}

export default RouteView;