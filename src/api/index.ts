import { ResponseBody } from '@/types'
import request from '@/utils/request'

const testRequest = (params?: any, data?: any):Promise<ResponseBody>  => {
  return request('GET', '/api/test', params, data, {
    isCache: true
  })
}

export {
  testRequest
}