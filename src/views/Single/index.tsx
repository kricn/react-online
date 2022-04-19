import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';

interface ModalProps {
  visible: boolean
  children?: JSX.Element | JSX.Element[]
}

function Modal (props: ModalProps) {

  const [mounted, setMounted] = useState<boolean>(false)

  const renderComponent = useCallback(() => {
    return (
      <div style={{display: props.visible ? 'block' : 'none'}}>
        {props?.children ? props.children : <></>}
      </div>
    )
  }, [props.visible, props.children])

  useEffect(() => {
    if (props.visible && !mounted) setMounted(true)
  }, [props.visible, mounted])


  return (
    !mounted ? <></> : renderComponent()
  )
}

function Single() {

  const [visible, setVisible] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [visible2, setVisible2] = useState<boolean>(false)

  return (
    <div>
      <Button type="primary" onClick={() => setCount(val => val+1)}>点击增加</Button>
      <Button onClick={() => setVisible(val => !val)}>点击控制modal1显示/关闭</Button>
      <Button onClick={() => setVisible2(val => !val)}>点击控制modal2显示/关闭</Button>
      <Modal visible={visible}>
        <div>modal 内容</div>
        <div>{count}</div>
      </Modal>
      <Modal visible={visible2}>
        <div>modal 内容2</div>
      </Modal>
    </div>
  )
}

export default Single;
