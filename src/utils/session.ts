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
const LOGIN_TOKEN_NAME = 'token'

export const getToken = ():string => {
  return sessionStorage.getItem(LOGIN_TOKEN_NAME) || ''
}

export const setToken = (token:string) => {
  sessionStorage.setItem(LOGIN_TOKEN_NAME, token)
}