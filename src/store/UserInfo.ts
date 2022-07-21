
import { removeToken, setToken } from '@/utils/session'
import {observable, action, makeObservable} from 'mobx'

interface FileInfo {
  url: string
  status?: string,
  name?: string
}
interface User {
  username?: string
  avatar?: FileInfo[]
  uuid?: string
  nickName?: string
  headerImg?: string,
  token?: ''
}

interface Users {

}

class UserInfo {

  constructor() {
    makeObservable(this)
  }

  @observable users: Users[] = []  //用户数据库
  @observable user: User = {}  //当前登录用户信息

  // 切换用户状态
  @action update(info: User) {
    this.user = Object.assign({}, this.user, info)  //设置登录用户信息
    // 给用户默认头像
    if (!this.user.avatar) {
      this.user.avatar = [{url: this.user.headerImg  ? '/api' + this.user.headerImg : require('@/assets/avatar.webp'), name: 'avatar'}]
    }
    setToken('user-info', JSON.stringify(this.user))
  }
  
  @action reset() {
    this.user = {}
    removeToken()
    removeToken("user-info")
  }
}

export default new UserInfo()