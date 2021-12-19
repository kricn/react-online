import React, { lazy, LazyExoticComponent } from 'react'

interface Route {
  path: string
  component?: LazyExoticComponent<() => JSX.Element> | JSX.Element | any
  redeact?: string | React.Component
}

const route: Array<Route> = [
  {
    path: '/',
    component: lazy(() => import('@/layout/default'))
  }
]

export default route

