import axios, { AxiosResponse } from 'axios'
import { ResponseBody } from '@/types'

const Service = axios.create({
  baseURL: '',
  timeout: 30 * 1000
})

//拦截器
//请求拦截
Service.interceptors.request.use(config => {
	return config
}, error => {
	return Promise.reject(error)
});

//相应拦截
Service.interceptors.response.use((response: AxiosResponse<ResponseBody>) => {
	const data = response.data
	return data
}, error => {
  // 构建接口错误返回结构
	return {
    code: -1,
    msg: `${error}`,
    data: null
  }
});

interface RequestOptions {
  headers?: any
}

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT'

const request = (method: Method, path: string, data?: any, options?: RequestOptions):Promise<any> => {
  return Service({
    method: method,
    url: path,
    params: method === 'GET' ? data : {},
    data: method !== 'GET' ? data : {},
    headers: options?.headers,
    ...options,
  })
}

export default request