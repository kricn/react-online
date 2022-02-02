import { Spin } from 'antd';

import style from './index.module.scss'
const LazyLoading = () => {
  return (
    <div className={`${style.loadingWrapper} flex fvertical fcenter`}>
      <Spin tip="loading" />
    </div>
  )
}

export default LazyLoading