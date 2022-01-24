import { useNavigate, useLocation } from 'react-router'

import menus from '@/router/menu'

import { RouteInterface } from '@/types/router'

import { Menu } from 'antd'

const { SubMenu } = Menu


function SiderNav() {
  
  const navigate = useNavigate()
  const location = useLocation()

  const renderMenu = (routes:Array<RouteInterface>)=> {
    return (
      <Menu 
        theme="dark" 
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
      >
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
            return renderFirstMenu(item)
          })
        }
      </SubMenu>
    )
  }
  return renderMenu(menus);
}

export default SiderNav
