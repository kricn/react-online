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
    path: '/user',
    component: lazy(() => import('@/views/User')),
    meta: {
      title: '个人中心',
      icon: HomeOutlined,
      hidden: true
    }
  },
  {
    path: '/ui',
    meta: {
      title: "交互",
      icon: HomeOutlined
    },
    children: [
      {
        path: '/ui/dragger',
        component: lazy(() => import('@/views/Ui/Dragger')),
        meta: {
          title: '拖拽',
          icon: HomeOutlined
        }
      },
    ]
  },
  {
    path: '/performance',
    meta: {
      title: '性能优化',
      icon: HomeOutlined
    },
    children: [
      {
        path: '/performance/virtual-list',
        component: lazy(() => import('@/views/Performance/VirtualList')),
        meta: {
          title: '虚拟列表',
          icon: HomeOutlined
        }
      },
      {
        path: '/performance/time-slice',
        component: lazy(() => import('@/views/Performance/TimeSlice')),
        meta: {
          title: '时间切片',
          icon: HomeOutlined
        }
      },
    ]
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
    path: '/design-patterns',
    meta: {
      title: '设计模式',
      icon: HomeOutlined
    },
    children: [
      {
        path: '/esign-patterns/single',
        component: lazy(() => import('@/views/DesignPatterns/Single')),
        meta: {
          title: '单例模式',
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
]

export default menu