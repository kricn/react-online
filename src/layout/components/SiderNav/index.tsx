import menus from '@/router/menu'

import { RouteInterface } from '@/types/router'

import { Menu } from 'antd'

const { SubMenu } = Menu

const renderMenu = (routes:Array<RouteInterface>)=> {
  return (
    <Menu theme="dark">
      {
        routes.map(route => {
          if (!route.children) return renderFirstMenu(route)
          if (route.children.length === 1) return renderFirstMenu(route.children[0])
          if (route.children.length > 1) return renderMultMenu(route)
          return ''
        })
      }
    </Menu>
  )
}

const renderFirstMenu = (route: RouteInterface) => {
  return (
    !route?.meta?.hidden ? <Menu.Item key={route.path}>{route?.meta?.title}</Menu.Item> : ''
  )
}

const renderMultMenu = (subRoute: RouteInterface) => {
  return (
    <SubMenu title={subRoute.meta.title}>
      {
        subRoute.children?.map(item => {
          return renderFirstMenu(item)
        })
      }
    </SubMenu>
  )
}

function SiderNav() {
  return renderMenu(menus);
}

export default SiderNav
