import { lazy } from 'react'

import menu from './menu'

import { RouteInterface } from '@/types/router'

export const baseRouters = [
  {
    path: '/login',
    component: lazy(() => import('@/views/Login')),
  },
  {
    path: '/404',
    component: lazy(() => import('@/views/404'))
  }
]

export const whiteRouterList = baseRouters.map(item => item.path)

const route: Array<RouteInterface> = [
  {
    path: '/',
    component: lazy(() => import('@/layout/default')),
    children: menu,
    to: '/login',
    meta: {
      auth: true
    }
  }
]

export default route

