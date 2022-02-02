import { lazy } from 'react'

import menu from './menu'

import { RouteInterface } from '@/types/router'

const route: Array<RouteInterface> = [
  {
    path: '/',
    component: lazy(() => import('@/layout/default')),
    children: menu,
    to: '/login',
    meta: {
      auth: true
    }
  },
  {
    path: '/login',
    component: lazy(() => import('@/views/Login')),
  },
  {
    path: '/404',
    component: lazy(() => import('@/views/404'))
  }
]

export default route

