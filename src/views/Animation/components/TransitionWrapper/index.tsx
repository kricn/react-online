
import React, { useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const style = require('./index.modules.scss').default

interface Props {
  children: React.ReactElement
  component?: null  // 是否渲染标签
  timeout?: number
  classNames?: string
  trigger?: string // 触发方式 默认是 hover
}

export default function TransitionWrapper(props: Props) {

  const [isActived, setIsActived] = useState(false)
  const [trigger, setTrigger] = useState(props.trigger ? props.trigger : 'hover')
  const [Son, setSon] = useState({...props.children})

  const handleChildrenClick = () => {
    setIsActived(!isActived)
  }

  const handleChildrenHover = () => {
    setIsActived(!isActived)
  }

  useEffect(() => {
    // 不通过额外的节点去增加子元素的属性
    setSon({
      ...props.children,
      props: {
        ...props.children.props,
        onClick: () => {
          props.children.props.onClick && props.children.props.onClick()
          trigger === 'click' && handleChildrenClick()
        },
        onMouseEnter: () => {
          props.children.props.onMouseEnter && props.children.props.onMouseEnter()
          trigger === 'hover' && handleChildrenHover()
        },
        onMouseOut: () =>  {
          props.children.props.onMouseOut && props.children.props.onMouseOut()
          trigger === 'hover' && handleChildrenHover()
        }
      }
    })
  }, [props.children])

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        classNames={`pointer ${isActived ? props.classNames : ''}`}
        timeout={props.timeout || 300}
        key={isActived ? 'in' : 'out'}
      >
        {Son}
      </CSSTransition>
    </SwitchTransition>
  )
}
