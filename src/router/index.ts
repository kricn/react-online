import React, { lazy, LazyExoticComponent } from 'react'

interface RouteInterface {
  path: string
  component?: LazyExoticComponent<() => JSX.Element> | JSX.Element | any
  redeact?: string | React.Component,
  children?: Array<RouteInterface>
}

const route: Array<RouteInterface> = [
  {
    path: '/',
    component: lazy(() => import('@/layout/default'))
  }
]

export default route

