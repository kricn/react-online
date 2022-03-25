
import { inject, observer } from 'mobx-react'
import { Menu, Dropdown } from 'antd';
// import { useAsyncState } from '@/components/UseAsyncState';
const style = require('./index.module.scss').default

function HeaderBar({ appStore }: any) {

  const logout = () => {
    appStore.toggleLogin({})
  }

  const menu = (
    <Menu>
      <Menu.Item key="out" onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <div className={`flex fvertical ${style.header}`}>
      <Dropdown overlay={menu}>
        <div className='flex fvertical pointer'>
          <div className={style.username}>{appStore.userInfo.username || '用户未登录'}</div>
          {/* <div className='note'></div> */}
          <div className={`${style.avatar} mgl_20`}>
            <img src={appStore.userInfo?.avatar ? appStore.userInfo.avatar[0].url : require("@/assets/avatar.webp")} alt="avatar" />
          </div>
        </div>
      </Dropdown>
    </div>
  );
}

export default inject('appStore')(observer(HeaderBar));
