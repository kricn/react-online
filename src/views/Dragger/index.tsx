
import React, { useEffect, useState } from 'react'

import style from './index.module.scss'
import { deepCopy } from '@/utils'

interface DragList {
  label: string
  value: string
}

export default function Dragger() {

  const [list, setList] = useState<DragList[]>([])

  // 拖拽 id
  const [dragId, setDragId] = useState<string | undefined>(undefined)
  // 放置 id
  const [dropId, setDropId] = useState<string | undefined>(undefined)
  // 放置节点
  const [dropNode, setDropNode] = useState<EventTarget & HTMLDivElement | undefined>(undefined)

  const getList = () => {
    setList(
      Array.from({length: 10}, (_, index) => ({
        label: `拖拽第 ${index + 1} 项`,
        value: `${index}`
      }))
    )
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    setListItemAnimation(dropNode)
    move(dragId, dropId)
    // 消除 eslint 警告
    // eslint-disable-next-line
  }, [dragId, dropId, dropNode])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const ele = e.target as HTMLElement
    e.dataTransfer.setData('DRAG_NODE_ID', ele.id)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const ele = e.target as HTMLElement
    e.preventDefault();
    var data = e.dataTransfer.getData('DRAG_NODE_ID');
    ele.appendChild(document.getElementById(data) as HTMLElement);
  }


  // 交换数组间的元素
  const move = (dragId?: string, dropId?:string) => {
    if (!dragId || !dropId) return ;
    const dragIndex = list.findIndex(item => item.value === dragId)
    const dropIndex = list.findIndex(item => item.value === dropId)
    // 需要深拷贝一次，不然会打乱原来的布局
    const listClone: DragList[] = deepCopy(list)
    const dragItem = listClone.splice(dragIndex, 1)
    if (!dragItem) return ;
    const res = [
      ...listClone.slice(0, dropIndex),
      ...dragItem,
      ...listClone.slice(dropIndex)
    ]
    setList(res)
  }

  // 列表项点击 记录点击 id
  const listItemDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    setDragId((e.currentTarget as HTMLElement).dataset.index); // 从 dataset 获取拖拽项的 id
  }

  // 列表项放置 记录放置节点和id
  const listItemDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 允许放置，阻止默认事件
    const currentDropId = e.currentTarget.dataset.index
    // 自己放置在自己处不计算
    setDropId((oldVal: string | undefined) => {
      if (currentDropId !== oldVal) oldVal = currentDropId
      return oldVal
    })
    setDropNode(e.currentTarget)
  };

  // 给列表添加动画
  const setListItemAnimation = (node: EventTarget & HTMLDivElement | undefined) => {
    const dragIndex = list.findIndex(item => item.value === dragId)
    const dropIndex = list.findIndex(item => item.value === dropId)
    node?.classList.remove(style["drop-up"], style["drop-down"]);
    if (dragIndex < dropIndex) {
      node?.classList.add(style["drop-down"]);
    } else if (dragIndex > dropIndex) {
      node?.classList.add(style["drop-up"]);
    }
  }

  // 点击项需要设置透明度为 0, 这样看起来像是被拖走
  const listItemDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "0";
  }
  // 还原透明度
  const listItemDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "1";
  }

  return (
    <>
      <div className='flex' onDrop={handleDrop}  onDragOver={e => e.preventDefault()}>
        <div className={style.box} id="dragger" onDragStart={handleDragStart} draggable>拖拽元素</div>
        <div className={style.drop} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>放置区域</div>
      </div>

      <div className={style.list}>
        {
          !list.length ? 'loading.....' :
          list.map(item => {
            return (
              <div 
                className={style.listItem} 
                key={item.value} 
                draggable 
                data-index={item.value}
                onDragStart={listItemDragStart} 
                onDragOver={listItemDragOver}
                onDrag={listItemDrag}
                onDragEnd={listItemDragEnd}
              >{item.label}</div>
            )
          })
        }
      </div>
    </>
    
  )
}
