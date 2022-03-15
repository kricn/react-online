import { testRequest } from '@/api/index'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import testStore from '@/store/testStore'

import { Button, Empty } from 'antd'

const style = require('./index.module.scss').default

function Home() {

  const { state } = testStore

  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getList = async () => {
    setLoading(true)
    const payload = {
      name: 'haha'
    }
    const data = {
      age: 18
    }
    const res = await testRequest(payload, data)
    if (res.code === 1) {
      setList(res?.data)
    }
    setLoading(false)
  }

  const handleToogleState = () => {
    testStore.toggleState(!state)
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <div className={style.home}>
      home
      <div className={style.btnGroup}>
        <Button type='primary' onClick={getList}>再次请求</Button>
        <Button type='primary' onClick={handleToogleState}>改变状态</Button>
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
