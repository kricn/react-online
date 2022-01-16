import { lazy } from 'react'

import menu from './menu'

import { RouteInterface } from '@/types/router'

const route: Array<RouteInterface> = [
  {
    path: '/',
    component: lazy(() => import('@/layout/default')),
    redeact: '/home',
    children: menu
  }
]

export default route

