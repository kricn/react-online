
import style from './index.module.scss'
export default function Dragger() {

  const handleDrag = (e: any) => {
    console.log(e)
  }

  return (
    <div>
      <div className={style.box} onDrag={handleDrag} draggable></div>
    </div>
  )
}
