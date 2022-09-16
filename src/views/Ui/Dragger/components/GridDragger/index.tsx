
import { useEffect, useState } from 'react'
import style from './index.module.scss'

import { deepCopy } from '@/utils'

interface ListItem {
  label: string,
  value: string,
}

export default function GridDragger() {

  const [list, setList] = useState<ListItem[]>([])

  // 拖拽 id
  const [dragId, setDragId] = useState<string | undefined>(undefined)
  // 放置 id
  const [dropId, setDropId] = useState<string | undefined>(undefined)

  // 列表项点击 记录点击 id
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "copyMove";
    setDragId((e.currentTarget as HTMLElement).dataset.index); // 从 dataset 获取拖拽项的 id
  }

  // 列表项放置 记录放置节点和id
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 允许放置，阻止默认事件
    const currentDropId = e.currentTarget.dataset.index
    // 自己放置在自己处不计算
    setDropId((oldVal: string | undefined) => {
      if (currentDropId !== oldVal) oldVal = currentDropId
      return oldVal
    })
  }

  // 点击项需要设置透明度为 0, 这样看起来像是被拖走
  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "0";
  }
  // 还原透明度
  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "1";
  }

  // 交换数组间的元素
  const move = (dragId?: string, dropId?:string) => {
    if (!dragId || !dropId) return ;
    const dragIndex = list.findIndex(item => item.value === dragId)
    const dropIndex = list.findIndex(item => item.value === dropId)
    // 需要深拷贝一次，不然会打乱原来的布局
    const listClone: ListItem[] = deepCopy(list)
    const dragItem = listClone.splice(dragIndex, 1)
    if (!dragItem) return ;
    const res = [
      ...listClone.slice(0, dropIndex),
      ...dragItem,
      ...listClone.slice(dropIndex)
    ]
    setList(res)
  }

  useEffect(() => {
    move(dragId, dropId)
    // eslint-disable-next-line
  }, [dragId, dropId])


  useEffect(() => {
    const getList = () => {
      setList(
        Array.from({length: 9}, (_, index) => ({
          label: `第 ${index + 1} 项`,
          value: index + 1 + ''
        }))
      )
    }
    getList()
  }, [])

  return (
    <div className={style.container}>
      <ul className={style.list} onDragOver={e => e.preventDefault()}>
        {
          list.map(item => {
            return (
              <div 
                className={style['list-item']} 
                key={item.value}
                draggable
                data-index={item.value}
                onDragStart={onDragStart} 
                onDragOver={onDragOver}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
              >
                <div className={style['list-item__inner']}>
                  {item.label}
                </div>
              </div>
            )
          })
        }
      </ul>
    </div>
  )
}
