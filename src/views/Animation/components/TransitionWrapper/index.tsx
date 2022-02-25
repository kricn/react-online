
import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

interface Props {
  children: React.ReactElement
  component?: null  // 是否渲染标签
  timeout?: number
  classNames?: string
}

export default function TransitionWrapper(props: Props) {

  const [isActived, setIsActived] = useState(false)
  const [Son, setSon] = useState({...props.children})

  const handleChildrenClick = useCallback(
    () => {
      setIsActived(!isActived)
    }, 
    [isActived]
  )

  // 在 test 分支上添加注释

  useEffect(() => {
    // 不通过额外的节点去增加子元素的属性
    setSon({
      ...props.children,
      props: {
        ...props.children.props,
        onClick: () => {
          props.children.props.onClick && props.children.props.onClick()
          handleChildrenClick()
        }
      }
    })
  }, [props.children, handleChildrenClick])

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        classNames={`pointer ${props.classNames}`}
        timeout={props.timeout || 300}
        key={isActived ? 'in' : 'out'}
      >
        <div>{Son}</div>
      </CSSTransition>
    </SwitchTransition>
  )
}
