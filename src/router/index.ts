import { lazy } from 'react'

import menu from './menu'

import { RouteInterface } from '@/types/router'

const route: Array<RouteInterface> = [
  {
    path: '/',
    component: lazy(() => import('@/layout/default')),
    children: menu
  },
  {
    path: '/login',
    component: lazy(() => import('@/views/Login')),
  }
]

export default route

