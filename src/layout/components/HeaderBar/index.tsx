
const style = require('./index.module.scss').default

export default function HeaderBar() {
  return (
    <div className={`flex fvertical ${style.header}`}>
      <div className={style.username}>用户名</div>
      {/* <div className='note'></div> */}
      <div className={`${style.avatar} mgl_20 pointer`}>
        <img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/26/16ea83b0a0fe25a6~tplv-t2oaga2asx-no-mark:100:100:100:100.awebp" />
      </div>
    </div>
  );
}
