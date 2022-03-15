import { ResponseBody } from '@/types'
import request from '@/utils/request'

const testRequest = (params?: any):Promise<ResponseBody>  => {
  return request('GET', '/api/test', params)
}

export {
  testRequest
}