import { lazy } from 'react'
import { RouteInterface } from '@/types/router'

import {
  HomeOutlined
} from '@ant-design/icons'

const menu:Array<RouteInterface> = [
  {
    path: '',
    index: true,
    to: '/home',
    component: lazy(() => import('@/components/UnitComponent/Redirect')),
    meta: {
      hidden: true
    }
  },
  {
    path: '/home',
    component: lazy(() => import('@/views/Home')),
    meta: {
      title: '首页',
      icon: HomeOutlined
    }
  },
  {
    path: '/animation',
    component: lazy(() => import("@/views/Animation")),
    meta: {
      title: '动画',
      icon: HomeOutlined
    }
  },
  {
    path: '/about',
    component: lazy(() => import('@/views/About')),
    meta: {
      title: '关于',
      icon: HomeOutlined
    },
    children: [
      {
        path: '/about/test',
        component: lazy(() => import('@/views/User')),
        meta: {
          title: '关于下的子菜单'
        }
      },
      {
        path: '/about/test2',
        component: lazy(() => import('@/views/User')),
        meta: {
          title: '关于下的子菜单2'
        }
      }
    ]
  },
  {
    path: '/user',
    component: lazy(() => import('@/views/User')),
    meta: {
      title: '个人中心',
      icon: HomeOutlined,
      auth: true
    }
  }
]

export default menu