import request from '@/utils/request'

const testRequest = (params?: any):Promise<ResponseBody>  => {
  return request('GET', '/api/test', params, {
    isCache: true
  })
}

export {
  testRequest
}