import {  LazyExoticComponent } from 'React'

export interface RouteInterface {
  path: string
  component?: LazyExoticComponent<() => JSX.Element> | JSX.Element | any
  redeact?: string | React.Component,
  children?: Array<Route>
}