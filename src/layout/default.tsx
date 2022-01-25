// 第三方
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd';
import { useState } from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'

// 自定义
import SiderNav from './components/SiderNav'
import HeaderBar from './components/HeaderBar';

// 样式
const style = require('./default.module.scss').default;

const { Sider, Header, Content } = Layout

function DefaultLayout () {
  const [collapsed, setcollapsed] = useState(false)

  const toggleCollapsed = () => {
    setcollapsed(!collapsed)
  }

  return (
    <Layout>
      <Sider collapsible trigger={null} collapsed={collapsed} >
        <div className={style.logo}></div>
        <SiderNav />
        <div className={style.trigger} onClick={() => toggleCollapsed ()}>
          { collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined /> }
        </div>
      </Sider>
      <Layout>
        <Header>
          <HeaderBar />
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default DefaultLayout