import config from '@/utils/config'

const LOGIN_COOKIE_NAME = 'token'

export function isAuthenticated () {
  return _getCookie(LOGIN_COOKIE_NAME)
}

export function authenticateSuccess (token: string) {
  _setCookie(LOGIN_COOKIE_NAME, token)
}

export function logout () {
  _setCookie(LOGIN_COOKIE_NAME, '', 0)
}

function _getCookie (name: string) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return document.cookie.substring(start, end)
    }
  }
  return ''
}

function _setCookie (name: string, value: string, expire: number=10) {
  let date = new Date()
  date.setDate(date.getDate() + expire)
  document.cookie = name + '=' + value + '; path=/' +
    (expire ? ';expires=' + date.toUTCString() : '')
}

/** token 方法 */

export const getToken = (name?: string):string => {
  return sessionStorage.getItem(name || config.tokenKey) || ''
}

export const setToken = (name: string, token:string) => {
  sessionStorage.setItem(name, token)
}

export const removeToken = (name?: string) => {
  sessionStorage.removeItem(name || config.tokenKey)
}