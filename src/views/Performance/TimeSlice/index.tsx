
import { Button, Input } from 'antd'
import { useRef, useState } from 'react'
import style from './index.module.scss'

/** 阻塞函数生成器 */
function *timeSliceGenerator(): Generator<number, number, number> {
  let i: number = 0
  const start = performance.now()
  while (performance.now() - start <= 5000) {
      yield i++
  }
  return i
}

/** 简易时间切片 */
function timeSliceFunc () {
  return async function () {
    const fnc_: Generator = timeSliceGenerator()
    let data: IteratorResult<any> | null = null;
    do {
      data = fnc_.next(await data?.value)
      // 每执行一步就休眠，注册一个宏任务 setTimeout 来叫醒他
      await new Promise(resolve => setTimeout(resolve))
    } while (!data.done)

    return data.value
  }
}

/** 精准时间切片 */
function _timeSliceFunc (time: number = 25) {
  return function () {
    const fnc_: Generator = timeSliceGenerator()
    let data: IteratorResult<any> | null = null;

    return new Promise(async function go (resolve, reject) {
      try {
        const start = performance.now()
        // 马上执行
        do {
          data = fnc_.next(await data?.value)
          // 超过时间差值来调度函数是否继续执行，没超过则继续执行下一步
        } while (!data.done && performance.now() - start < time)

        if (data.done) return resolve(data.value)
        // 退出循环后，将控制权交还给给主线程，生成一个宏任务，
        setTimeout(() => go(resolve, reject))
      } catch(e) {
        reject(e) 
      }
    })
  }
}

/** 主进程阻塞函数 */
function process() {
  let i = 0
  const start = performance.now()
  while (performance.now() - start <= 5000) {
      i++
  }
  return i
}

export default function TimeSlice() {

  const boxRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState<string>('')
  let timer: NodeJS.Timeout | null = null

  /** 输入框 */
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  /** 重置当前状态 */
  const resetState = () => {
    boxRef.current?.classList.remove(style.move)
    if (timer) {
      clearTimeout(timer as NodeJS.Timeout)
      timer = null
    }
    setTimeout(() => {
      boxRef.current?.classList.add(style.move)
    });
  }

  /** 直接渲染 */
  const onRender = () => {
    resetState()
    !timer && (timer = setTimeout(() => {
      process()
      clearTimeout(timer as NodeJS.Timeout)
    }, 1000));
  }

  /** 迭代器实现 */
  const onRenderByGenerator = () => {
    resetState()
    if (!timer) {
      timer = setTimeout(async () => {
        const fnc = timeSliceFunc()
        let start: number = performance.now()
        console.log('简易版开始')
        await fnc()
        console.log('简易版结束', `${(performance.now() - start)/ 1000}s`)
        
        start = performance.now()
        console.log('优化版开始')
        const _fnc = _timeSliceFunc()
        await _fnc()
        console.log('优化版结束', `${(performance.now() - start)/ 1000}s`)
      }, 1000);
    }
  }

  /** idle 实现 */
  const onRenderByIdle = () => {
    resetState()
    const now = performance.now()
    let index = 0
    requestIdleCallback(func)
    function func(handler: IdleDeadline) {
      while(performance.now() - now <= 5000 && handler.timeRemaining()) {
        index ++;
        console.log(index)
        console.log('可分配时间', handler.timeRemaining())
      }
      if (performance.now() - now <= 5000) {
        requestIdleCallback(func);
      }
    }
  }


  return (
    <div className={style.container}>
      <h2>TimeSlice</h2>
      <Input value={inputValue} onChange={onChange} />
      <div className='mgt_20'>
        <Button className='mgr_20' type="primary" onClick={onRender}>直接渲染</Button>
        <Button className='mgr_20' type="primary" onClick={onRenderByGenerator}>迭代器时间切片渲染</Button>
        <Button type="primary" onClick={onRenderByIdle}>requestIdleCallback渲染</Button>
      </div>
      <div className={style.box} ref={boxRef}></div>
    </div>
  )
}
