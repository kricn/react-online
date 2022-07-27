/**
 * 简单的深拷贝
 * @param {object} obj
 */
const deepCopy = (target: any, map = new WeakMap()): any => {
  if (typeof target === "object") {
    const isArray: boolean = Array.isArray(target);
    let cloneTarget: any = isArray ? [] : {};

    // 防止循环引用
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);

    if (!isArray) {
      Object.keys(target).forEach(key => {
        cloneTarget[key] = deepCopy(target[key], map);
      })
    } else {
      target.forEach((_: any, index: number) => {
        cloneTarget[index] = deepCopy(target[index], map);
      })
    }

    return cloneTarget;
  } else {
    return target;
  }
};


/**
 * 防抖
 */
function debounce1(this: any, fn: Function, wait: number) {
  //定义定时器变量
  let timer: NodeJS.Timeout | null = null;
  //保存当前函数this
  let context: void = this;
  let args: IArguments = arguments;
  return function () {
    //如果在wait时间内再次触发，清空定时器重新计算时间
    if (timer) clearTimeout(timer);
    let callNow = !timer;
    //达到wait时间，将定时器指向null
    timer = setTimeout(() => {
      timer = null;
    }, wait);
    //定时器为null时会执行回调函数，即fn，只要触发就一定会执行一次
    if (callNow) fn.apply(context, args);
  };
}

export { deepCopy, debounce1 };
