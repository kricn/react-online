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
  // {
  //   path: '/animation',
  //   component: lazy(() => import("@/views/Animation")),
  //   meta: {
  //     title: '动画',
  //     icon: HomeOutlined
  //   }
  // },
  // {
  //   path: '/about',
  //   component: lazy(() => import('@/views/About')),
  //   meta: {
  //     title: '关于',
  //     icon: HomeOutlined
  //   },
  //   children: [
  //     {
  //       path: '/about/test',
  //       component: lazy(() => import('@/views/User')),
  //       meta: {
  //         title: '关于下的子菜单'
  //       }
  //     },
  //     {
  //       path: '/about/test2',
  //       component: lazy(() => import('@/views/User')),
  //       meta: {
  //         title: '关于下的子菜单2'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: lazy(() => import('@/views/User')),
    meta: {
      title: '个人中心',
      icon: HomeOutlined
    }
  },
  {
    path: '/dragger',
    component: lazy(() => import('@/views/Dragger')),
    meta: {
      title: '拖拽',
      icon: HomeOutlined
    }
  },
  {
    path: '/virtual-list',
    component: lazy(() => import('@/views/VirtualList')),
    meta: {
      title: '虚拟列表',
      icon: HomeOutlined
    }
  },
  {
    path: '/layout',
    meta: {
      title: '布局',
      icon: HomeOutlined
    },
    children: [
      {
        path: '/layout/fall',
        component: lazy(() => import('@/views/Layout/Fall')),
        meta: {
          title: '瀑布流',
          icon: HomeOutlined
        }
      }
    ]
  },
  {
    path: '/test',
    component: lazy(() => import('@/views/Test')),
    meta: {
      hidden: true
    }
  }
  // {
  //   path: '/canvas',
  //   component: lazy(() => import('@/views/Canvas')),
  //   meta: {
  //     title: 'canvas',
  //     icon: HomeOutlined
  //   }
  // }
]

export default menu