
// import TransitionWrapper from './components/TransitionWrapper'
import { useState } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { Button } from 'antd'
import style from './index.module.scss'

export default function Anaimation() {
  const [trigger, setTrigger] = useState<boolean>(false)

  const toggleBoxStatus = () => {
    setTrigger(val => !val)
  }

  return (
    <div>
      <Button onClick={toggleBoxStatus}>trigger</Button>
        <SwitchTransition mode="out-in">
          <CSSTransition 
            classNames={`slide-scale`}
            timeout={300}
            key={trigger ? "in" : "off"
          }>
            <div style={{width: '100px', height: '100px', background: '#1818'}}>
              aaa
            </div>
          </CSSTransition>
        </SwitchTransition>
    </div>
  )
}
