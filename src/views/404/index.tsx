import { useNavigate } from 'react-router';

import { Result, Button } from 'antd';

const style = require('./index.module.scss').default

export default function NotFond() {

  const navigate = useNavigate()

  return (
    <div className={`${style.container} flex fvertical fcenter`}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
      />
    </div>
  )
}
