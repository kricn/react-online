
import { inject, observer } from 'mobx-react'
import { Menu, Dropdown } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAsyncState } from '@/components/UseAsyncState';
const style = require('./index.module.scss').default

function HeaderBar({ UserInfo }: any) {


  const navigate = useNavigate()

  const logout = useCallback(() => {
    UserInfo.reset()
    navigate('/login', {replace: true})
    // eslint-disable-next-line
  }, [])

  const toEggs = useCallback(() => {
    navigate('/test')
  }, [navigate])

  const menu = (
    <Menu>
      <Menu.Item key="user" onClick={() => navigate("/user")}>个人中心</Menu.Item>
      <Menu.Item key="out" onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <div className={`flex fvertical ${style.header}`}>
      <Dropdown overlay={menu}>
        <div className='flex fvertical pointer'>
          <div className={style.username}>{UserInfo.user.username || '用户未登录'}</div>
          {/* <div className='note'></div> */}
          <div className={`${style.avatar} mgl_20`} onDoubleClick={toEggs}>
            <img src={UserInfo.user.avatar} alt="avatar" />
          </div>
        </div>
      </Dropdown>
    </div>
  );
}

export default inject('UserInfo')(observer(HeaderBar));
