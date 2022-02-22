
import { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { Button } from 'antd'

import style from './index.module.scss'

export default function Anaimation() {

  const [isShowBox, setIsShowBox] = useState(true)

  const toggleBoxStatus = () => {
    setIsShowBox(!!!isShowBox)
  }

  return (
    <div className={style.container}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          classNames={{
            enterActive: style['box-enter-active'],
            enter: style['box-enter'],
            exitActive: style['box-exit-active'],
            exit: style['box-exit'],
          }}
          timeout={500}
          key={isShowBox ? 'show' : 'unshow'}
          appear
        >
          <div className={style.box}>{isShowBox ? 'true' : 'false'}</div>
        </CSSTransition>
      </SwitchTransition>
      <Button type="primary" onClick={toggleBoxStatus}>switch box status</Button>
    </div>
  )
}
