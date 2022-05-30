
import React from 'react'

import style from './index.module.scss'

import DraggerList from './components/DraggerList'

export default function Dragger() {

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

  return (
    <>
      <div className='flex mgb_20' onDrop={handleDrop}  onDragOver={e => e.preventDefault()}>
        <div className={style.box} id="dragger" onDragStart={handleDragStart} draggable>拖拽元素</div>
        <div className={style.drop} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>放置区域</div>
      </div>
      <div className='mgb_20'>
        <DraggerList />
      </div>
      
    </>
    
  )
}
