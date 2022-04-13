
import { inject, observer } from 'mobx-react'
import { Menu, Dropdown } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAsyncState } from '@/components/UseAsyncState';
const style = require('./index.module.scss').default

function HeaderBar({ appStore }: any) {

  const navigate = useNavigate()

  const logout = useCallback(() => {
    appStore.toggleLogin({})
  }, [appStore])

  const toEggs = useCallback(() => {
    navigate('/test')
  }, [navigate])

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
          <div className={`${style.avatar} mgl_20`} onDoubleClick={toEggs}>
            <img src={appStore.userInfo?.avatar ? appStore.userInfo.avatar[0].url : require("@/assets/avatar.webp")} alt="avatar" />
          </div>
        </div>
      </Dropdown>
    </div>
  );
}

export default inject('appStore')(observer(HeaderBar));
