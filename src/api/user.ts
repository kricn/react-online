import request from '@/utils/request'

const login = (params?: any) => {
  return request('POST', '/api/login', params)
}

const getUserInfo = (params?: any) => {
  return request('GET', '/api/user/getUserInfo', params)
}

export {
  login,
  getUserInfo
}