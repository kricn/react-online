
import { removeToken, setToken } from '@/utils/session'
import {observable, action, makeObservable} from 'mobx'

interface FileInfo {
  url: string
  status?: string,
  name?: string
}
interface UserInfo {
  username?: string
  avatar?: FileInfo[]
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
  @action toggleLogin(info: UserInfo) {
    this.userInfo = info  //设置登录用户信息
    // 给用户默认头像
    if (!this.userInfo.avatar) {
      this.userInfo.avatar = [{url: require('@/assets/avatar.webp'), name: 'avatar'}]
    }
    if (this.userInfo.username) {
      setToken('token', this.userInfo.username)
      setToken('user-info', JSON.stringify(this.userInfo))
    } else {
      removeToken('token')
      removeToken('user-info')
    }
  }
}

export default new AppStore()