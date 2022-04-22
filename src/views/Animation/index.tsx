
// import TransitionWrapper from './components/TransitionWrapper'
import { useEffect, useRef, useState } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { Button } from 'antd'

import style from './index.module.scss'

interface AnimationInterface {
  children: React.ReactElement
  classNames?: string

}

const AnimationWrapper = (props: AnimationInterface) => {

  const boxRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<"in" | "out">('in');

  useEffect(() => {
    const animationName = props?.classNames
    if (animationName) {
      boxRef.current?.classList.remove(style[animationName + 'On'])
      boxRef.current?.classList.add(style[animationName + 'On'])
    }
  }, [props.children])

  useEffect(() => {
    boxRef.current?.addEventListener('animationend', () => {
      console.log('a')
    })
  }, [])
  
  return (
    <div ref={boxRef}>{props.children}</div>
  )
}

export default function Anaimation() {
  const [trigger, setTrigger] = useState<boolean>(true)
  const [aTrigger, setATrriger] = useState<boolean>(true)

  const toggleBoxStatus = () => {
    setTrigger(val => !val)
  }

  const toogleABoxStatus = () => {
    setATrriger(val => !val)
  }

  return (
    <div>
      <h1>使用 transition-group 实现 </h1>
      <Button className='mgb_10' type='primary' onClick={toggleBoxStatus}>点击显示/隐藏</Button>
      <SwitchTransition mode="out-in">
        <CSSTransition 
          classNames={`slide-scale`}
          timeout={300}
          key={trigger ? "in" : "off"
        }>
          { trigger ? (
              <div className={style.box}>
                aaa
              </div>
            ) : <></>
          }
        </CSSTransition>
      </SwitchTransition>
      <h1 className='mgt_30'>使用 css3 animation 实现 </h1>
      <Button className='mgb_10' type='primary' onClick={toogleABoxStatus}>点击显示/隐藏</Button>
      <AnimationWrapper classNames="box">
        { aTrigger ? (<div className={`${style.box}`}>
          bbb
        </div>) : <div className={`${style.box}`}>
          ccc
        </div>}
      </AnimationWrapper>
    </div>
  )
}
