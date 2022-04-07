import { useEffect, useMemo, useRef, useState } from 'react'

import style from './index.module.scss';

interface FallWrapperProps {
  column?: number  // 瀑布流列数
  children: JSX.Element[],
  height?: string  // 容器高度
  getList: Function // 触发滚动加载
  isMore?: Boolean  // 是否还能继续加载
  offset?: number
}

function FallWrapper (props: FallWrapperProps) {

  // 瀑布列列数
  const [column] = useState<number>(props?.column || 3);
  // 最小高度列的下标
  const [minColumnIndex, setMinColumnIndex] = useState<number>(0);
  // 最小高度列的高度
  const [minColumnHeight, setMinColumnHeight] = useState<number>(0);
  // 遍历子节点的下标，到时候滚动加载的时候不会重复遍历多前的列表
  const [childIndex, setChildIndex] = useState<number>(0);
  // 每一列的宽度
  const columnWidth = useMemo(() => `${100 / column}%`, [column])
  // 容器 ref
  const fallWrapperRef = useRef<HTMLDivElement | null>(null);
  // 距离底部偏移量
  const offset = useMemo(() => props.offset || 100, [props.offset])
  // 是否还能继续加载
  const isMore = useMemo(() => props?.isMore || true, [props.isMore])

  // 初始化列的子节点
  const columnChild = useMemo(() => {
    const tmpMap: Map<number, JSX.Element[]> = new Map()
    for (let i = 0; i < column; i ++) {
      tmpMap.set(i, [])
    }
    return tmpMap
  }, [column])

  // 每加入一次节点，就更新一次列的下标和列的高度
  useEffect(() => {
    const columns: NodeListOf<HTMLDivElement> = document.querySelectorAll(`.${style.column}`)
    let minHeight = columns[0].offsetHeight
    let tmpIndex = 0
    columns.forEach((node, index) => {
      if (node.offsetHeight < minHeight) {
        tmpIndex = index
        minHeight = node.offsetHeight
      }
    })
    setMinColumnHeight(minHeight)
    setMinColumnIndex(tmpIndex)
  }, [childIndex])

  // 取节点更新，不用通过循环一下子更新
  useEffect(() => {
    if (props.children?.length < childIndex) {
      setChildIndex(0)
      return ;
    }
    const item = props.children[childIndex]
    columnChild.set(minColumnIndex, columnChild.get(minColumnIndex) ? [...columnChild.get(minColumnIndex) as JSX.Element[], item] : [item])
    // 子节点坐标更新
    childIndex + 1 <= props.children?.length && setChildIndex(childIndex + 1)
    // eslint-disable-next-line
  }, [minColumnIndex, props.children, minColumnHeight])

  const renderFallColumn = () => {
    const rows: JSX.Element[] = []
    for (let i = 0; i < column; i ++) {
      rows.push(
        <div key={i} style={{width: columnWidth}} className={style.column}>
          { columnChild.get(i) }
        </div>
      )
    }
    return rows;
  }

  // 从外部重新从头开始更新
  // eslint-disable-next-line
  const updateColumn = () => {
    setChildIndex(0)
  }

  // 判断滚动距离
  const handleScrollTop = (e: Event) => {
    const ele = e.target as HTMLDivElement
    // 滚动高度
    const scrollTop = ele.scrollTop
    // 容器高度
    const containerHeight = ele.offsetHeight
    if (scrollTop + containerHeight >= minColumnHeight - offset) {
      props.getList()
      if (!isMore) {
        const wrap = fallWrapperRef?.current
        wrap && wrap.removeEventListener('scroll', handleScrollTop)
      }
    }
  }

  // 判断滚动条触底
  const getChontainerScroll = () => {
    const wrap = fallWrapperRef?.current
    if (wrap) {
      wrap.addEventListener('scroll', handleScrollTop)
      if (minColumnHeight - offset < wrap.offsetHeight && isMore) {
        props.getList()
      }
    }
  }

  useEffect(() => {
    getChontainerScroll()
    // eslint-disable-next-line
  }, [])

  return (
    <div className={style.fallWrapper} style={{height: props.height}} ref={fallWrapperRef}>
      { renderFallColumn() }
    </div>
  )
}

interface ListInterface {
  label: string
  value: number
  height?: number
}

const pageSize = 10

function Fall() {

  // 列表数据
  const [list, setList] = useState<ListInterface[]>([]);
  // 加载页数
  const [page, setPage] = useState<number>(1);

  const getList = () => {
    const tmpList: ListInterface[] = []
    for (let i = pageSize * (page - 1); i < pageSize * page; i++) {
      let labelString = '某君昆仲，今隐其名，皆余昔日在中学时良友；分隔多年，消息渐阙。日前偶闻其一大病；适归故乡，迂道往访，则仅晤一人，言病者其弟也。劳君远道来视，然已早愈，赴某地候补⑵矣。因大笑，出示日记二册，谓可见当日病状，不妨献诸旧友。持归阅一过，知所患盖“迫害狂”之类。语颇错杂无伦次，又多荒唐之言；亦不著月日，惟墨色字体不一，知非一时所书。间亦有略具联络者，今撮录一篇，以供医家研究。记中语误，一字不易；惟人名虽皆村人，不为世间所知，无关大体，然亦悉易去。至于书名，则本人愈后所题，不复改也。七年四月二日识。'
      if (Math.random() < 0.2) {
        labelString = '凡事总须研究，才会明白。古来时常吃人，我也还记得，可是不甚清楚。我翻开历史一查，这历史没有年代，歪歪斜斜的每页上都写着“仁义道德”几个字。我横竖睡不着，仔细看了半夜，才从字缝里看出字来，满本都写着两个字是“吃人”！'
      } else if (Math.random() > 0.2 && Math.random() < 0.6) {
        labelString = '凡事总须研究，才会明白。古来时常吃人，我也还记得，可是不甚清楚。我翻开历史一查，这历史没有年代，歪歪斜斜的每页上都写着“仁义道德”几个字。我横竖睡不着，仔细看了半夜，才从字缝里看出字来，满本都写着两个字是“吃人”！'
      }
      tmpList.push({
        label: labelString + i,
        value: i
      })
    }
    setPage(page + 1)
    setList([...list, ...tmpList])
  }

  useEffect(() => {
    getList()
    // eslint-disable-next-line
  }, [])

  return (
    <div className={style.listContainer}>
      <FallWrapper getList={getList}>
        {
          list.map(item => {
            return (
              <div
                key={item.value}
                className={style.listItem}
              >
                <div className={style.listInner}>
                  {item.label}
                </div>
              </div>
            )
          })
        }
      </FallWrapper>
    </div>
  )
}

export default Fall;
