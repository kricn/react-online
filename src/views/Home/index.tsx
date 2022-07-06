import { testRequest } from '@/api/index'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import { Button, Empty } from 'antd'

const style = require('./index.module.scss').default

function Home() {

  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getList = async () => {
    setLoading(true)
    const payload = {
      name: 'haha'
    }
    const res = await testRequest(payload)
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
      <div className={style.btnGroup}>
        <Button type='primary' onClick={getList}>再次请求</Button>
      </div>
      <div>
        {
          loading ? 'loading.....' :
            list.length ?
              list.map(item => {
                return <div key={item.value}>{item.label} - {item.value}</div>
              }) :
              <Empty />
          }
      </div>
    </div>
  )
}

export default observer(Home)
