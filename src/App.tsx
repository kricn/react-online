import { inject, observer } from 'mobx-react'

import RouteView from '@/components/RouterGuard';
import './App.css';

function App({appStore}: any) {

  // 登录状态改变在这里处理
  console.log(appStore.isLogin)

  return <RouteView />
}

export default inject('appStore')(observer(App));
