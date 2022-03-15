import qs from 'qs';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseBody } from '@/types';
import LRUCache from './LRUCache';

// 请求缓存
const cachePool = new Map<String, LRUCache>()

// 拼接所有请求的参数和路径
const generateKey = (config: AxiosResponse<ResponseBody>): string => {
  const { method, params, data, url } = config.config
  return [ method, url, qs.stringify(params), qs.stringify(data) ].join('&')
}

// 响应成功才缓存
// 处理缓存
const handleCacheRequest = (response: AxiosResponse<any>) => {
  const url: string | undefined = response?.config?.url
  // 没有 url 的跳过缓存
  if (!url) return ;
  // 每个 url 生成一个 LRU 缓存实例
  if (!cachePool.has(url)) {
    cachePool.set(url, new LRUCache())
  }
  // 生成 LRU 缓存实例的 key
  const LRUCacheKey = generateKey(response)
  const cacheItem = cachePool.get(url)
  // 对值进行缓存
  cacheItem?.put(LRUCacheKey, response.data)
}

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

interface AxiosResponseExtend extends AxiosResponse<ResponseBody, any> {
  config: AxiosRequestConfig & RequestOptions
}

// 响应拦截
Service.interceptors.response.use(((response: AxiosResponseExtend) => {
  if (response.config.isCache) {
    handleCacheRequest(response)
  }
	const data = response.data
	return data
  // 此处需要断言为 any，不然自定义不了类型
}) as any, error => {
  // 构建接口错误返回结构
	return {
    code: -1,
    msg: `${error}`,
    data: null
  }
});

interface RequestOptions {
  headers?: any
  isCache?: boolean
}

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT'

const request = (method: Method, path: string, params?: any, data?: any, options?: RequestOptions):Promise<any> => {
  if (cachePool.has(path)) {
    const key = [ method, path, qs.stringify(params), qs.stringify(data) ].join('&')
    return Promise.resolve(cachePool.get(path)?.get(key))
  }
  return Service({
    method,
    url: path,
    params,
    data,
    headers: options?.headers,
    ...options,
  })
}

export default request