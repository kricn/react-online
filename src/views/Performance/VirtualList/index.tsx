
import { useAsyncState } from '@/components/UseAsyncState'
import { Spin } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import style from './index.module.scss'

interface ListItem {
  label: string
  value: number
}

interface PostionCacheItem {
  label?: string
  value?: number
  index: number
  height: number
  bottom: number
}

enum CompareResult {
  eq = 1,  // 等于
  lt = 2,  // 小于
  gt = 3,  // 大于
}

// 默认列表项高度
const defaultItemHeight: number = 64

// 容器高度
const containerHeight: number = 600

function VirtualList() {

  // 列表
  const [list, setList] = useAsyncState<ListItem[]>([])
  // loading
  const [loading, setLoading] = useAsyncState<boolean>(false)
  // 元素开始下标
  const [startIndex, setStartIndex] = useState<number>(0)
  // 缓存列表位置
  const [positionCache, setPositionCache] = useState<PostionCacheItem[]>([])
  // 容器元素
  const ContainerRef = useRef<HTMLDivElement | null>(null)
  // 视口元素
  const ViewRef = useRef<HTMLDivElement>(null)

  // 列表高度
  const listHeight = useMemo(() => {
    const len = positionCache.length
    if (len) {
      // 直接返回最后一项的高度省去循环计算的时间
      return positionCache[len - 1].bottom
    }
    return list.length * defaultItemHeight
  }, [list, positionCache])

  // 容器还能放下多少个元素
  const limit = useMemo(() => {
    let sum = 0;
    let i = startIndex + 1
    for (; i < positionCache.length; i ++) {
      sum += positionCache[i].height
      if (sum > containerHeight) {
        break ;
      }
    }
    // 返回填充下标的差值，并在容器外至少多渲染一个元素
    // 这样在一些高度刚好的情况下，滚动条不会因为触底而滚动不了
    return i - startIndex + 1
  }, [startIndex, positionCache])

  // 元素结束坐标
  const endIndex = useMemo(() => {
    return Math.min(startIndex + limit, list.length - 1)
    // eslint-disable-next-line
  }, [startIndex, limit])

  // 获取开始下标，二分法
  const getStartIndex = (scrollTop: number): number => {
    let idx = binarySearch(positionCache, scrollTop)
    const targetItem = positionCache[idx]
    // 调整 startIndex 指向存在视口的第一项
    if (targetItem?.bottom < scrollTop) {
      idx += 1
    }
    return idx
  }
   // 二分查找
  const binarySearch = (list: PostionCacheItem[], value: number): number => {
    let start: number = 0
    let end: number = list.length - 1;
    let tmpIndex: number = 0;
    while (start <= end) {
      // 取中点
      tmpIndex = Math.floor((end + start) >> 1)
      const midItem: PostionCacheItem = list[tmpIndex]
      const compareRes: number = compareValue(midItem?.bottom, value)
      if (compareRes === CompareResult.eq) {
        return tmpIndex
      }
      if (compareRes === CompareResult.lt) {
        start = tmpIndex + 1
      } else if (compareRes === CompareResult.gt) {
        end = tmpIndex - 1
      }
    }
    return tmpIndex;
  }

  // 值比较
  const compareValue = (currentValue: number, targetValue: number): number => {
    if (currentValue === targetValue) return CompareResult.eq
    if (currentValue < targetValue) return CompareResult.lt
    return CompareResult.gt
  }

  // 列表滚动时
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement, UIEvent> | Event) => {
    if (e.target !== ContainerRef.current) return;
    const ele = e.target as HTMLDivElement
    const scrollTop = ele.scrollTop;
    const currentStartIndex = getStartIndex(scrollTop);
    if (currentStartIndex !== startIndex) {
      setStartIndex(currentStartIndex);
    }
    // eslint-disable-next-line
  }, [ContainerRef, startIndex, positionCache])

  // 获取列表
  const getList = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const len: number = 200
    const tmp = {
      label: '',
      value: -1,
    }
    const res: ListItem[] = new Array(len)
    for (let i = 0; i < len; i ++) {
      const rand = Math.random()
      let randStr = ''
      if (rand < 0.2) randStr = new Array(Math.ceil(Math.random() + Math.random() + rand) * 100).fill('这').join("")
      if (rand > 0.2 && rand < 0.6) randStr = '之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之'
      if (rand > 0.6) randStr = '田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田困田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田'
      res[i] = {...tmp}
      res[i].label = `第 ${i + 1} 项` + randStr
      res[i].value = i
    }
    setLoading(false)
    setList(res)
  }

  // 视口偏移量计算
  // 用来模拟滚动的
  // 视口不存在全部数据，高度自然也不会和全部数据那么高
  // 相对于整个列表高度而定位，这样在 list 滚动的时候
  // 去改变定位位置和视口的数据，就好像滚动一样
  const getTransform = useCallback(() => {
    return `translate3D(0, ${startIndex > 0 ? positionCache[startIndex - 1].bottom : 0}px, 0)`
  },[positionCache, startIndex])

  useEffect(() => {
    getList()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const positList: PostionCacheItem[] = [];
    list.forEach((item, i) => {
      positList[i] = {
        ...item,
        index: i,
        height: defaultItemHeight,
        bottom: (i + 1) * defaultItemHeight,
      }
    })
    setPositionCache(positList)
  }, [list])

  useEffect(() => {
    const nodeList = ViewRef?.current?.childNodes as NodeListOf<HTMLDivElement>;
    const positList = [...positionCache]
    let needUpdate = false;
    nodeList?.forEach(node => {
      // 节点的高度
      const newHeight = node.getBoundingClientRect().height;
      const nodeIndex = Number(node.dataset.index);
      // 已经缓存了的节点高度
      const oldHeight = positList[nodeIndex].height
      // 已经缓存了的 bottom
      const oldBottom = positList[nodeIndex].bottom
      // 新的 bottom, 因为节点的高度可能改变了，所以 bottom 也要更新
      const newBottom = nodeIndex > 0 ? positList[nodeIndex - 1].bottom + newHeight : newHeight
      // 高度的差值
      const dHeight = newHeight - oldHeight
      // bottom 的差值
      const dBottom = newBottom - oldBottom
      // 只要有差值的时候才更新，主要是往回滚的时候
      if (dHeight || dBottom) {
        needUpdate = true
        positList[nodeIndex].height = newHeight
        positList[nodeIndex].bottom = newBottom
        if (positList[positList.length - 1].bottom < newBottom) {
          positList[positList.length - 1].bottom = newBottom
        }
      }
      needUpdate && setPositionCache(positList)
    })
    // eslint-disable-next-line
  }, [startIndex, ViewRef, positionCache])

  // 渲染列表项
  const renderListItem = useCallback(() => {
    const rows = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = list[i]
      rows.push(
        <div className={style.listItem} key={item.value} data-index={item.value}>
          <div>{i + 1}</div>
          <div>{item.label}</div>
        </div>
      )
    }
    return rows;
    // eslint-disable-next-line
  }, [startIndex, endIndex])

  return (
    <Spin spinning={loading}>
      <div className={style.container} ref={ContainerRef} style={{height: `${containerHeight}px`}} onScroll={handleScroll}>
        <div className={style.list} id="list" style={{height: `${listHeight}px`}}>
          <div ref={ViewRef} style={{ transform: getTransform()}}>
            {renderListItem()}
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default VirtualList;
