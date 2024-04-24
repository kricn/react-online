import { lazy } from 'react'
import { RouteInterface } from '@/types/router'

import {
  BlockOutlined,
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
    path: '/embed',
    meta: {
      title: '嵌套菜单',
      icon: BlockOutlined
    },
    children: [
      {
        path: '/embed/embed-1',
        component: lazy(() => import('@/views/Embed/Embed1')),
        meta: {
          title: '嵌套菜单1'
        },
      },
      {
        path: '/embed/embed-2',
        component: lazy(() => import('@/views/Embed/Embed2')),
        meta: {
          title: '嵌套菜单2'
        },
      },
    ]
  }
]

export default menu