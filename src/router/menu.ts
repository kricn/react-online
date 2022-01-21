import { lazy } from 'react'
import { RouteInterface } from '@/types/router'

const menu:Array<RouteInterface> = [
  {
    path: '',
    index: true,
    to: 'home',
    component: lazy(() => import('@/components/Redirect')),
    meta: {
      hidden: true
    }
  },
  {
    path: 'home',
    component: lazy(() => import('@/views/Home')),
    meta: {
      title: '首页'
    }
  },
  {
    path: 'about',
    component: lazy(() => import('@/views/About')),
    meta: {
      title: '关于'
    }
  },
  {
    path: 'user',
    component: lazy(() => import('@/views/User')),
    meta: {
      title: '个人中心',
      auth: true
    }
  }
]

export default menu