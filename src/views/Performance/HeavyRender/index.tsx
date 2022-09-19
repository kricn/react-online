
import { useEffect, useState } from 'react';
import style from './index.module.scss';
import { Button } from 'antd';
const staticData: List[] = Array.from({length: 1 << 13}, (_, index) => {
  return {
    label: (Math.random() * 100).toFixed(3),
    value: index
  }
})

interface List {
  label: string
  value: number
}

let ideaCallbackId: number | null = null

export default function HeavyRender() {

  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<List[]>([]);

  const getList = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const setListByIdle = () => {
    let index = 0
    let canSetList = true
    requestIdleCallback(func)
    function func(handler: IdleDeadline) {
      while(canSetList && handler.timeRemaining()) {
        index ++;
        console.log(index)
        console.log('可分配时间', handler.timeRemaining())
      }
      setList(prevState => {
        const res = [...prevState, ...staticData.slice(prevState.length, index)]
        canSetList = res.length === index
        return res
      })
      if (canSetList) {
        requestIdleCallback(func);
      }
    }
  }

  function* listGenerator() {
    let i = 0
    while (i < list.length) {
        yield i++
    }
    return i
  }
  /**
   * 
   * @param time 调度时间 ms
   */
  // eslint-disable-next-line
  const setListByGenerator = (time: number = 1) => {
    const fnc_ = listGenerator()
    let data: IteratorResult<any> | null = null
    return new Promise(async function go(resolve, reject) {
      try {
        const start = performance.now()
        // 马上执行
        do {
          data = fnc_.next(await data?.value)
          // 超过时间差值来调度函数是否继续执行，没超过则继续执行下一步
        } while (!data.done && performance.now() - start < time)
        setList(prevState => {
          const res = [...prevState, ...staticData.slice(prevState.length, data?.value)]
          return res
        })
        if (data.done) return resolve(data.value)
        // 退出循环后，将控制权交还给给主线程，生成一个宏任务，
        setTimeout(() => go(resolve, reject))
      } catch(e) {
        reject(e) 
      }
    })
  }
  
  const renderList = () => {
    if (loading) return '加载中....'
    return (
      <div className={style.box}>
        {
          list.map(item => {
            return (
              <div className={style['box-item']} key={item.value}>{item.label} - {item.value}</div>
            )
          })
        }
      </div>
    )
  }

  /**
   * 
   * @param type 渲染方式
   */
  const onRender = async (type: 'direct' | 'split') => {
    setLoading(true)
    setList([])
    await getList()
    type === 'direct' ? setList(staticData) : setListByIdle()
  }

  useEffect(() => {
    onRender("direct")
    return () => {
      ideaCallbackId && cancelIdleCallback(ideaCallbackId)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <div className='mgb_20'>
        <Button type='primary' className="mgr_20" onClick={() => onRender('direct')}>直接渲染</Button>
        <Button type='primary' onClick={() => onRender('split')}>分片渲染</Button>
      </div>
      <div className='flex fbetween'>
        {
          renderList()
        }
        <div className={style['animation-container']}>
          <div className={style['animation-box']}></div>
        </div>
      </div>   
    </>
     
  )
}
