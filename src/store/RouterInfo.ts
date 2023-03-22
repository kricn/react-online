import { RouteInterface } from '@/types/router'
import {observable, action, makeObservable} from 'mobx'


class RouterInfo {

  constructor() {
    makeObservable(this)
  }

  //当前登录用户路由信息
  @observable routers: Array<RouteInterface> = []
  
  // 正在获取当前路由信息
  @observable loading: Boolean = false

  @action toggleLoading = () => {
    this.loading = !this.loading
  }

  // 切换用户状态
  @action update(info: Array<RouteInterface>) {
    this.routers = [...info]  //设置登录用户路由信息
  }
  
  @action reset() {
    this.routers = []
  }
}

export default new RouterInfo()