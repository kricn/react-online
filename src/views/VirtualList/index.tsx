
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
    // 这里要比视图区域渲染多至少一个点以上，不然前面的点高的总和大于了初始的容器高度，则整个列表都不能再滚动了
    // 会出现不能显示全或有一小断空白情况
    // 这里为什么需要加 3 ？
    // 因为 i - startIndex + 1 是 limit 的数量，容器还可以放多少个
    // 但因为 startIndex 那个节点可能只有一部分显示在试图范围愉
    // 所以需要加多一个节点补到后面的空白部分，这样视图就可以做到连续了
    // 这样虽然可以连续，但当滚动到一定程度后，前面的总高度可能>=最后一个节点的 bottom，
    // 会倒是数据不能全部显示
    // 在视图外多渲染一个的好处是，每次滚动都会计算下一个的 bottom
    // 在没有到底部之前，就永远有下一个的高度，这样直接返回最后一个 bottom 值当作总高度即可
    // 所以这里需要至少加 3
    return  i - startIndex + 3
  }, [positionCache, startIndex]);

  // 计算结束下标
  const endIndex = useMemo(() => {
    return Math.min(startIndex + limit, list.length - 1);
    // eslint-disable-next-line
  }, [startIndex, limit])

  // 列表总高度
  const listHeight = useMemo(() => {
    let len = positionCache.length;
    if (len !== 0) {
      // 直接返回最后一个点的 bottom，这样不用累加所有节点的高度
      // 同时，累加所有节点的高度时，高度会不正确，尚不清楚原因
      return positionCache[len - 1].bottom
    }
    return list.length * defaultItemHeight;
  }, [positionCache, list])

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
      // 当前节点的高度
      const nodeIndex = Number(ele.dataset.index);
      // 原来记录的节点高度
      const oldHeight = positList[nodeIndex]["height"];
      // 两个高度的差值，有差值说明需要更新
      const dValue = oldHeight - newHeight;
      // 上一个节点的 bottom 
      const previousBottom = nodeIndex > 0 ? positList[nodeIndex - 1].bottom : positList[nodeIndex].height
      // 当前节点的 bottom 
      const thisBottom = positList[nodeIndex].bottom
      // 判断当前的 bottom 是否需要更新
      const dBottom = thisBottom - previousBottom - newHeight
      // 这里不能单纯的判断高度有差就更新
      // 还要判断它们的新老 bottom，bottom 有差值也要进行更新
      // 不然单纯的判断高度差可能元素的高度刚好和预设的一样，那有一个 bottom 不会更新
      // 之后的 bottom 值也会跟着出错
      if (dValue || dBottom) {
        needUpdate = true;
        positList[nodeIndex].height = newHeight;
        positList[nodeIndex].bottom = nodeIndex > 0 ? (positList[nodeIndex - 1].bottom + positList[nodeIndex].height) : positList[nodeIndex].height;
      }
    })
    if (needUpdate) {
      setPositionCache(positList)
    }
    // eslint-disable-next-line
  }, [scrollTop])

  const getTransform = useCallback(() => {
    // 这里做个偏移，这样在拉动过快时就不会出现白屏
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
