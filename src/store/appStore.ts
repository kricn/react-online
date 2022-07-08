
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
  uuid?: string
  nickName?: string
  headerImg?: string
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
  @action toggleLogin(info: UserInfo, token: string = '') {
    this.userInfo = info  //设置登录用户信息
    // 给用户默认头像
    if (!this.userInfo.avatar) {
      this.userInfo.avatar = [{url: '/api' + this.userInfo.headerImg || require('@/assets/avatar.webp'), name: 'avatar'}]
    }
    if (this.userInfo.uuid) {
      setToken('user-info', JSON.stringify(this.userInfo))
    } else {
      removeToken('user-info')
    }
    token ? setToken('token', token) : removeToken()
  }
}

export default new AppStore()