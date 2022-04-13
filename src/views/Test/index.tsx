import { useAsyncState } from '@/components/UseAsyncState';
import { useCallback, useEffect, useRef } from 'react'

interface List {
  label: string
  value: number
}

export default function Test() {

  const [list, setList] = useAsyncState<List[]>([]);

  const unmountedRef = useRef<boolean>(false);

  const getList = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const tmp = []
    for (let i = 0; i < 10; i ++) {
      tmp.push({
        label: `第 ${i + 1} 项`,
        value: i + 1
      })
    }
    setList(tmp)
  }, [setList])

  useEffect(() => {
    return () => {
      unmountedRef.current = true
    }
  }, [])

  useEffect(() => {
    getList()
  }, [getList])

  return (
    <div>
      <h1>测试页面</h1>
      {
        list.map(item => {
          return <div key={item.value}>{item.label}</div>
        })
      }
    </div>
  )
}
