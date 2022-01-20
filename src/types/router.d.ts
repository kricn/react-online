import {  LazyExoticComponent } from 'React'

export interface RouteInterface {
  path: string
  index?: boolean,
  to?: string,
  component?: any
  redeact?: any,
  children?: Array<Route> | null,
  meta?: any
}