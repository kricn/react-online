
import { USER_INFO_NAME } from '@/utils/constance'
import { removeToken, setToken } from '@/utils/session'
import {observable, action, makeObservable} from 'mobx'

interface User {
  username: string
  avatar: string
  id: string
  token: string
}

const initUserInfo = () => ({
  username: '',
  avatar: '',
  id: '',
  token: ''
})

class UserInfo {

  constructor() {
    makeObservable(this)
  }

  //当前登录用户信息
  @observable user: User = initUserInfo()

  // 切换用户状态
  @action update(info: User) {
    this.user = Object.assign({}, this.user, info)  //设置登录用户信息
    // 给用户默认头像
    if (!this.user.avatar) {
      this.user.avatar = require('@/assets/avatar.webp')
    }
    setToken('user-info', JSON.stringify(this.user))
  }
  
  @action reset() {
    initUserInfo()
    removeToken()
    removeToken(USER_INFO_NAME)
  }
}

export default new UserInfo()