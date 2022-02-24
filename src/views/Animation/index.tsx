
import TransitionWrapper from './components/TransitionWrapper'
import style from './index.module.scss'

export default function Anaimation() {

  return (
    <div className={style.container}>
      {/* <SwitchTransition mode="out-in">
        <CSSTransition
          classNames={`pointer ${isHover ? 'fade-sildeX' : ''}`}
          timeout={300}
          key={isHover ? 'in' : 'out'}
          appear
        >
          <div className={style.box} onMouseEnter={toggleBoxStatus} onMouseOut={toggleBoxStatus}></div>
        </CSSTransition>
      </SwitchTransition> */}
      <TransitionWrapper
        classNames='fade-sildeX'
      >
        <div className={`${style.box}`}></div>
      </TransitionWrapper>
    </div>
  )
}
