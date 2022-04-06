

class LRUCache {

  // 存储 map 对象
  private cacheMap: Map<string, any>;
  // 缓存的大小
  private capacity: number;

  constructor(capacity: number = 12) {
    this.cacheMap = new Map();
    this.capacity = capacity
  }

  public get(key: string) {
    // key 存在
    if (this.cacheMap.has(key)) {
      const value = this.cacheMap.get(key)
      // 删除原来的 key 
      this.cacheMap.delete(key)
      // 在最后设置新的 key，最后一项是频率最高的
      this.cacheMap.set(key, value)
      return value
    }
    return -1
  }

  public put(key: string, value: any) {
    // key 存在，先删掉原来位置的 key，再插入对应的键值
    // 这样最后那个就是频率最高的
    if (this.cacheMap.has(key)) {
      this.cacheMap.delete(key)
    } else {
      // 插入数据前先判断，size是否符合capacity
      // 已经>=capacity，需要把最开始插入的数据删除掉
      // keys()方法得到一个可遍历对象,执行next()拿到一个形如{ value: 'xxx', done: false }的对象
      if (this.cacheMap.size >= this.capacity) {
        // 删除第一个数据，也就是频率最低的数据
        this.cacheMap.delete(this.cacheMap.keys().next().value)
      }
    }
    this.cacheMap.set(key, value)
  }

  public getMap() {
    return this.cacheMap
  }

  public getCapacity() {
    return this.capacity
  }
}

export default LRUCache