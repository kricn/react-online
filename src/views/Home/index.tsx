import { testRequest } from '@/api/index'
import { useEffect, useState } from 'react'

const style = require('./index.module.scss').default
export default function Home() {

  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getList = async () => {
    setLoading(true)
    const res = await testRequest()
    if (res.code === 1) {
      setList(res?.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <div className={style.home}>
      home
      {
        loading ? 'loading.....' :
        list.map(item => {
          return <div key={item.value}>{item.label} - {item.value}</div>
        })
      }
    </div>
  )
}
