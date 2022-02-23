/**
 * 简单的深拷贝
 * @param {object} obj
 */
const deepCopy = (obj: any): any => {
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  let result: Array<any> | any = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]);   //递归拷贝
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

/**
 * 防抖
 */
 function debounce1(this:any, fn: Function, wait: number) {
  //定义定时器变量
  let timer: NodeJS.Timeout | null = null;
  //保存当前函数this
  let context: void = this;
  let args:IArguments = arguments;
  return function () {
    //如果在wait时间内再次触发，清空定时器重新计算时间
    if(timer) clearTimeout(timer)
    let callNow = !timer;
    //达到wait时间，将定时器指向null
    timer = setTimeout(() => {
      timer = null;
    }, wait)
    //定时器为null时会执行回调函数，即fn，只要触发就一定会执行一次
    if(callNow) fn.apply(context, args);
  }
}

export {
  deepCopy,
  debounce1
}