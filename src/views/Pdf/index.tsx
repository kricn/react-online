
import { Button } from 'antd';
import { useRef } from 'react';

import { createPdfByElement } from '@/utils/pdf'

import style from './index.module.scss'

export default function HtmlToPdf() {

  const targetRef = useRef<HTMLDivElement>(null);

  const onPrint = () => {
    createPdfByElement(targetRef.current!, 'test')
  }

  return (
    <>
      <Button type="primary" onClick={onPrint}>打印</Button>
      <div ref={targetRef} className={style.targetWrapper}>
        <h2>打印内容</h2>
        <div className={style.box}>box content</div>
      </div>
    </>
  )
}
