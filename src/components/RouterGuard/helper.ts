


import { Suspense } from 'react';
import { Route } from 'react-router';

import LazyLoading from '@/components/UnitComponent/LazyLoading';

import { RouteInterface } from '@/types/router'

const checkAuth = (route: RouteInterface, auth: any) => {
  
}

let auth = true

const generateRoute:any = (routes:Array<RouteInterface>) => {
  return routes.filter(item => {
    if (item.children?.length) item.children = generateRoute(item.children)
    const { meta } = item
    if (!auth && meta?.auth) {
      return false
    } else {
      return true
    }
  })
}

export {
  generateRoute
}