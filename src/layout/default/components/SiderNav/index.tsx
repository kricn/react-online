import { useNavigate, useLocation } from 'react-router'

import menus from '@/router/menu'
import { inject, observer } from 'mobx-react'

import { RouteInterface } from '@/types/router'
import { generateRoute } from '@/components/RouterGuard/helper'

import { Menu } from 'antd'

const { SubMenu } = Menu


function SiderNav({ appStore }: any) {
  
  const navigate = useNavigate()
  const location = useLocation()

  // 获取默认打开的子菜单
  const getOpenKey = (path: string): Array<string> => {
    let result: Array<string> = []
    const pathArray = path.split('/')
    for (let i = 2; i < pathArray.length; i ++) {
      result.push(pathArray.slice(0, i).join('/'))
    }
    return result
  }

  // 渲染侧边栏
  const renderMenu = (routes:Array<RouteInterface>) => {
    return (
      <Menu 
        theme="dark" 
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={getOpenKey(location.pathname)}
      >
        {
          routes.map(route => {
            if (!route.children) return renderFirstMenu(route)
            if (route.children.length === 1) return renderFirstMenu(route.children[0])
            // 递归多级菜单
            if (route.children.length > 1) return renderMultMenu(route)
            return ''
          })
        }
      </Menu>
    )
  }
  
  // 渲染一级菜单
  const renderFirstMenu = (route: RouteInterface) => {
  
    return (
      !route?.meta?.hidden ? <Menu.Item icon={route.meta?.icon ? <route.meta.icon /> : ''} key={route.path} onClick={() => navigate(route.path)}>{route?.meta?.title}</Menu.Item> : ''
    )
  }
  
  // 渲染多级惨淡
  const renderMultMenu = (subRoute: RouteInterface) => {
    return (
      <SubMenu title={subRoute.meta?.title} key={subRoute.path} icon={subRoute.meta?.icon ? <subRoute.meta.icon /> : ''}>
        {
          subRoute.children?.map(item => {
            return renderFirstMenu(item)
          })
        }
      </SubMenu>
    )
  }
  return renderMenu(generateRoute(menus, !!appStore.userInfo?.username));
}

export default inject('appStore')(observer(SiderNav))
