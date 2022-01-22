import { Outlet } from 'react-router-dom'
import { Layout } from 'antd';

import SiderNav from './components/SiderNav'

const style = require('./default.module.scss');

const {Sider, Header, Content} = Layout

function DefaultLayout () {
  return (
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
  )
}

export default DefaultLayout