
import { inject, observer } from 'mobx-react'
import { useEffect } from 'react';
// import { useAsyncState } from '@/components/UseAsyncState';

const style = require('./index.module.scss').default

function HeaderBar({ appStore }: any) {

  useEffect(() => {
    console.log('aaa')
    // let timer: NodeJS.Timeout = setTimeout(() => {
    //   appStore.toggleLogin(false)
    // }, 2000)

    // let timer2:any = setTimeout(() => {
    //   appStore.toggleLogin(false)
    // }, 5000);

    return () => {
      // timer && clearTimeout(timer)
      // clearTimeout(timer2)
    }
  }, [appStore])
  return (
    <div className={`flex fvertical ${style.header}`}>
      <div className={style.username}>用户名{appStore.isLogin ? '已登录' : '未登录'}</div>
      {/* <div className='note'></div> */}
      <div className={`${style.avatar} mgl_20 pointer`}>
        <img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/26/16ea83b0a0fe25a6~tplv-t2oaga2asx-no-mark:100:100:100:100.awebp" alt="avatar" />
      </div>
    </div>
  );
}

export default inject('appStore')(observer(HeaderBar));
