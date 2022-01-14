import { Outlet, Link } from 'react-router-dom'
import menu from '@/router/menu'
function Layout () {
  return (
    <div className='default-layout'>
      {
        menu.map(item => {
          return (
            <Link key={item.path} to={item.path}>{item.meta.title}</Link>
          )
        })
      }
      <Outlet />
    </div>
  )
}

export default Layout