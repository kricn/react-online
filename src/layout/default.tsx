import { Outlet } from 'react-router-dom'
import { Layout } from 'antd';

import SiderNav from './components/SiderNav'

const {Sider, Header, Content} = Layout

function DefaultLayout () {
  return (
    <div id='page'>
        <Layout>
          <Sider collapsible
            trigger={null}
          >
            <SiderNav />
          </Sider>
          <Layout>
            <Header style={{background: '#fff', padding: '0 16px'}}>
              header
              {/* <HeaderBar collapsed={this.state.collapsed} onToggle={this.toggle}/> */}
            </Header>
            <Content>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </div>
  )
}

export default DefaultLayout