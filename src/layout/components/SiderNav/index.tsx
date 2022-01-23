import { useNavigate } from 'react-router'

import menus from '@/router/menu'

import { RouteInterface } from '@/types/router'

import { Menu } from 'antd'

const { SubMenu } = Menu

const renderMenu = (routes:Array<RouteInterface>)=> {
  return (
    <Menu theme="dark" mode="inline">
      {
        routes.map(route => {
          if (!route.children) return useFirstMenu(route)
          if (route.children.length === 1) return useFirstMenu(route.children[0])
          if (route.children.length > 1) return renderMultMenu(route)
          return ''
        })
      }
    </Menu>
  )
}

const useFirstMenu = (route: RouteInterface) => {
  let navigate = useNavigate()

  const toPage = (path:string) => {
    navigate(path)
  }

  return (
    !route?.meta?.hidden ? <Menu.Item key={route.path} onClick={() => toPage(route.path)}>{route?.meta?.title}</Menu.Item> : ''
  )
}

const renderMultMenu = (subRoute: RouteInterface) => {
  return (
    <SubMenu title={subRoute.meta.title} key={subRoute.path}>
      {
        subRoute.children?.map(item => {
          return useFirstMenu(item)
        })
      }
    </SubMenu>
  )
}

function SiderNav() {
  return renderMenu(menus);
}

export default SiderNav
