
import { Form, Button, Input } from 'antd'
import { inject, observer } from 'mobx-react'
import { useNavigate } from 'react-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { setToken } from '@/utils/session';

const style = require('./index.module.scss').default

// 表单 col 大小
const labelCol = 4

// 表单校验规则
const rules = {
  username: [{required: true, message: '请输入用户名'}],
  password: [{required: true, message: '请输入密码'}],
}

function Login({appStore}: any) {

  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onSubmit = () => {
    const username = form.getFieldValue('username')
    appStore.toggleLogin({username})
    setToken('token', username)
    navigate('/')
  }

  return (
    <div className={`${style.loginWrapper} flex fcenter fvertical`}>
      <div className={`${style.formWrapper} flex fvertical`}>
        <Form
          className={style.form}
          name="form"
          form={form}
          labelAlign='left'
          labelCol={{span: labelCol}}
          onFinish={onSubmit}
          
        >
          <Form.Item name="username" label="用户名" rules={rules.username}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={rules.password}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      
    </div>
  )
}

export default inject('appStore')(observer(Login))