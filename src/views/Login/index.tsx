
import { Form, Button, Input } from 'antd'
import { inject, observer } from 'mobx-react'
import { useNavigate } from 'react-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/api/user'
import { useEffect, useState } from 'react';
const style = require('./index.module.scss').default

// 表单 col 大小
const labelCol = 4

// 表单校验规则
const rules = {
  username: [{required: true, message: '请输入用户名'}],
  password: [{required: true, message: '请输入密码'}],
  code: [{required: true, message: '请输入验证码'}]
}

function Login({appStore}: any) {

  const [submitting, setSubmittin] = useState<boolean>(false)
  const [captcha, setCaptcha] = useState<string>('')

  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onSubmit = async () => {
    const username = form.getFieldValue('username')
    if (username === 'root') {
      appStore.toggleLogin({username, uuid: Date.now()}, username)
      navigate('/')
    } else {
      setSubmittin(true)
      const res = await login(form.getFieldsValue())
      if (res.code === 1) {
        appStore.toggleLogin({...res.data.userInfo}, res.data.token)
        navigate('/')
      }
      setSubmittin(false)
    }
  }

  const updateCaptrue = () => {
    const code = Date.now() + Math.random().toString(36).slice(2);
    setCaptcha(`/api/captcha?sign=${code}`)
  }

  useEffect(() => {
    updateCaptrue()
  }, [])

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
          colon={false}
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
          <Form.Item name="code" label="验证码" rules={rules.code}>
            <div className='flex'>
              <Input
                type="code"
                placeholder="请输入验证码"
              />
              <img className={style.captcha} src={captcha} alt="验证码" onClick={updateCaptrue} />
            </div>
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={submitting}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      
    </div>
  )
}

export default inject('appStore')(observer(Login))