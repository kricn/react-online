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

export {
  deepCopy
}