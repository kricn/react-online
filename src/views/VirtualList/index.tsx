
import { Spin } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import style from './index.module.scss'

interface ListItem {
  label: string
  value: number
}

interface PostionCacheItem {
  index: number
  height: number
  top: number
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
const containerHeight: number = 400

function VirtualList() {

  // 列表
  const [list, setList] = useState<ListItem[]>([])
  // loading 动画标志
  const [loading, setLoading] = useState<boolean>(false)
  // 分割数组开始坐标
  const [startIndex, setStartIndex] = useState<number>(0)
  // 容器滚动距离
  const [scrollTop, setScrollTop] = useState<number>(0)
  // 容器节点
  const ContainerRef = useRef<HTMLDivElement | null>(null)
  // 列表节点
  const ListRef = useRef<HTMLDivElement | null>(null)
  // 缓存列表位置
  const [positionCache, setPositionCache] = useState<PostionCacheItem[]>([])

  // 计算第几个元素开始超过容器底部
  const limit = useMemo(() => {
    let sum = 0
    let i = startIndex
    for (; i < positionCache.length; i ++) {
      sum += positionCache[i].height
      if (sum > containerHeight) {
        break;
      }
    }
    return  i - startIndex
  }, [positionCache, startIndex]);

  // 计算结束下标
  const endIndex = useMemo(() => {
    return Math.min(startIndex + limit, list.length - 1);
    // eslint-disable-next-line
  }, [startIndex, limit])

  // 列表总高度
  const listHeight = useMemo(() => {
    let len = positionCache.length;
    let sum = 0;
    for (let i = 0; i < len; i ++) {
      console.log(sum, positionCache[i], sum += positionCache[i].height, i)
    }
    // return sum
    if (len !== 0) {
      return positionCache[len - 1].bottom
    }
    return list.length * defaultItemHeight;
  }, [positionCache, list])

  // 获取列表
  const getList = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const len: number = 100
    const tmp = {
      label: '',
      value: -1,
    }
    const res: ListItem[] = new Array(len)
    for (let i = 0; i < len; i ++) {
      const rand = Math.random()
      let randStr = ''
      if (rand < 0.2) randStr = new Array(Math.ceil(Math.random() + Math.random() + rand) * 100).fill('这').join("")
      if (rand > 0.2 && rand < 0.6) randStr = '之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之之'
      if (rand > 0.6) randStr = '田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田困田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田田'
      res[i] = {...tmp}
      res[i].label = `第 ${i + 1} 项` + randStr
      res[i].value = i
    }
    setLoading(false)
    setList(res)
  }

  // 获取开始下标，二分法
  const getStartIndex = (scrollTop: number): number => {
    let idx = binarySearch(positionCache, scrollTop)
    const targetItem = positionCache[idx]
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

  // 滚动回调
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement, UIEvent> | Event) => {
    if (e.target !== ContainerRef.current) return;
    const ele = e.target as HTMLDivElement
    const scrollTop = ele.scrollTop;
    setScrollTop(scrollTop)
    const currentStartIndex = getStartIndex(scrollTop);
    if (currentStartIndex !== startIndex) {
      setStartIndex(currentStartIndex);
    }
    // eslint-disable-next-line
  }, [ContainerRef, startIndex, positionCache])

  // 触发滚动时，更新子项的高度
  useEffect(() => {
    const nodeList = ListRef?.current?.childNodes;
    const positList = [...positionCache]
    let needUpdate = false;
    nodeList?.forEach((node) => {
      const ele = node as HTMLDivElement
      let newHeight = ele.offsetHeight;
      const nodeIndex = Number(ele.dataset.index);
      const oldHeight = positionCache[nodeIndex]["height"];
      const dValue = oldHeight - newHeight;
      if (dValue) {
        needUpdate = true;
        positList[nodeIndex].height = newHeight;
        positList[nodeIndex].bottom = nodeIndex > 0 ? (positList[nodeIndex - 1].bottom + positList[nodeIndex].height) : positList[nodeIndex].height;
        positList[nodeIndex].top = nodeIndex > 0 ? positList[nodeIndex - 1].bottom : 0;
      }
    })
    if (needUpdate) {
      setPositionCache(positList)
    }
    // eslint-disable-next-line
  }, [scrollTop])

  const getTransform = useCallback(() => {
    return `translate3d(0,${startIndex >= 1 ? positionCache[startIndex - 1].bottom : 0}px,0)`
  }, [positionCache, startIndex]);

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    const positList: PostionCacheItem[] = [];
    list.forEach((_, i) => {
      positList[i] = {
        index: i,
        height: defaultItemHeight,
        top: i * defaultItemHeight,
        bottom: (i + 1) * defaultItemHeight,
      }
    })
    setPositionCache(positList)
  }, [list])

  const renderListItem = useCallback(() => {
    const rows = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = list[i]
      rows.push(
        <div 
          className={style.listItem} 
          data-index={item.value}
          key={item.value}
        >
          {item.label}
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
          <div ref={ListRef} style={{ transform: getTransform()}}>
            {renderListItem()}
          </div>
          
        </div>
      </div>
    </Spin>
  )
}

export default VirtualList;
