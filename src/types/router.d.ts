import {  LazyExoticComponent } from 'React'

export interface RouteInterface {
  path: string
  component?: LazyExoticComponent<() => JSX.Element> | JSX.Element | any
  redeact?: any,
  children?: Array<Route> | null,
  meta?: any
}