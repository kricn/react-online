import routers from '@/router/index'
import { Suspense } from 'react';
import { Routes, Route } from 'react-router';

// 只渲染对应的Route,外层需要用Routes包裹
const renderRoute = (route:any)  => {
  return (
    <Route
      path={route.path}
      element={
        <Suspense fallback={<>loading...</>}>
          <route.component />
        </Suspense>
      }
    ></Route>
  )
}

function RouteView () {
  return (
    <Routes>
      {
        // routers.map(item => {

        // })
      }
    </Routes>
  )
}

export default RouteView;