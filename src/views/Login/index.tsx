
import { Form, Button, Input, message } from 'antd'
import { inject, observer } from 'mobx-react'
import { useNavigate } from 'react-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/api/user'
import { useEffect } from 'react';
import { setToken } from '@/utils/session';
import { useRequest } from 'ahooks';
import { TOKEN_NAME } from '@/utils/constance';
const style = require('./index.module.scss').default

// 表单 col 大小
const labelCol = 4

// 表单校验规则
const rules = {
  username: [{required: true, message: '请输入用户名'}],
  password: [{required: true, message: '请输入密码'}],
  code: [{required: true, message: '请输入验证码'}],
}

let captchaId = ''

function Login({UserInfo}: any) {

  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onLogin = (): Promise<ResponseBody> => {
    const payload = {
      ...form.getFieldsValue(),
      captchaId
    }
    return login(payload)
  }

  const {loading: submitting, run: submitToLogin } = useRequest(onLogin, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 1) {
        UserInfo.update({...res.data.userInfo}, res.data.token)
        setToken(TOKEN_NAME, res.data.token)
        navigate('/')
      } else {
        message.error("账号或密码错误，没有开启后台服务可以使用账号 root 密码 root 登录")
      }
    }
  })

  const onSubmit = async () => {
    const username = form.getFieldValue('username')
    if (username === 'root') {
      UserInfo.update({username, uuid: Date.now(), token: 'root'})
      setToken(TOKEN_NAME, 'root')
      navigate('/')
    } else {
      submitToLogin()
    }
  }


  useEffect(() => {
    form.setFieldsValue({
      username: 'root',
      password: 'root',
      code: 'root'
    })
    // eslint-disable-next-line
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

export default inject('UserInfo')(observer(Login))