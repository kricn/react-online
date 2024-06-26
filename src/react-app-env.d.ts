/// <reference types="react-scripts" />

declare module 'jspdf'

declare module 'html2canvas'

declare module 'react-transition-group'

// 请求体返回结构
interface ResponseBody {
  code: number
  msg?: string,
  data?: any
}