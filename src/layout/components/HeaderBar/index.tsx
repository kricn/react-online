
import { inject, observer } from 'mobx-react'
import { Menu, Dropdown } from 'antd';
// import { useAsyncState } from '@/components/UseAsyncState';

import { removeToken } from '@/utils/session'
const style = require('./index.module.scss').default

function HeaderBar({ appStore }: any) {

  const logout = () => {
    appStore.toggleLogin(false)
    removeToken()
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
            <img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/26/16ea83b0a0fe25a6~tplv-t2oaga2asx-no-mark:100:100:100:100.awebp" alt="avatar" />
          </div>
        </div>
      </Dropdown>
    </div>
  );
}

export default inject('appStore')(observer(HeaderBar));
