import { Button } from 'antd'

const style = require('./index.module.scss').default
console.log(style)
export default function Home() {
  return (
    <div className={style.home}>
      home
      <Button type="primary">Home Click</Button>
    </div>
  )
}
