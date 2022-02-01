
import {observable, action, makeObservable} from 'mobx'

interface UserInfo {

}

interface Users {

}

class AppStore {

  constructor() {
    makeObservable(this)
  }

  @observable isLogin: Boolean = false  //利用cookie来判断用户是否登录，避免刷新页面后登录状态丢失
  @observable users: Users[] = []  //用户数据库
  @observable userInfo: UserInfo = {}  //当前登录用户信息

  // 切换用户状态
  @action toggleLogin(flag: boolean, info={}) {
    this.userInfo = info  //设置登录用户信息
    if (flag) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  }
}

export default new AppStore()