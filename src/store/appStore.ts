
import {observable, action, makeObservable} from 'mobx'

interface UserInfo {
  username?: string
}

interface Users {

}

class AppStore {

  constructor() {
    makeObservable(this)
  }

  @observable users: Users[] = []  //用户数据库
  @observable userInfo: UserInfo = {}  //当前登录用户信息

  // 切换用户状态
  @action toggleLogin(info?: UserInfo) {
    this.userInfo = info || {}  //设置登录用户信息
  }
}

export default new AppStore()