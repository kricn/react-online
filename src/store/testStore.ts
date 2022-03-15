
import {observable, action, makeObservable} from 'mobx'

class TestStore {

  constructor() {
    makeObservable(this)
  }

  @observable state: Boolean = false // 测试状态

  // 切换用户状态
  @action toggleState(flag: boolean) {
    this.state = flag
  }
}

export default new TestStore()