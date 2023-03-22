
import {
  Form,
  Input,
  Select,
  Button,
  Cascader,
  DatePicker,
  Checkbox,
  Upload,
  Spin,
  message
} from 'antd'

import {
  PlusOutlined,
  LoadingOutlined
} from '@ant-design/icons'

import { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'

import style from './index.module.scss'
import UserInfo from '@/store/UserInfo'

const { Option } = Select

// 表单 col 大小
const labelCol = 4

const rules: any = {
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
  agreement: [{validator: (_: any, value: any) => value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),}]
}

interface AddressOptions {
  label: string
  value: number | string,
  children?: AddressOptions[]
}
const addressOptions: AddressOptions[] = [
  {
    label: '广东省',
    value: 1,
    children: [
      {
        label: '广州市',
        value: 2,
        children: [
          {
            label: '天河区',
            value: 3
          }
        ]
      }
    ]
  }
]

interface SelectOptions {
  label: string
  value: number | string
}
const selectOptions: SelectOptions[] = [
  { label: 'React', value: 1 },
  { label: 'Vue', value: 2 },
  { label: 'JavaScript', value: 3 },
  { label: 'Java', value: 4 },
]

type ValidateStatus = '' | 'success' | 'warning' | 'error' | 'validating'
interface CustValidate {
  validateStatus: ValidateStatus,
  help?: string
}

interface FormValues {
  username?: string
  password?: string
  address?: number[] | string[]
  date?: moment.Moment | null,
  customize?: string
  avatar?: string
  files?: any[]
  cover?: any[]
  agreement?: boolean,
  type?: string
}
const getFormInitValues = (values?: FormValues): FormValues => {
  let res: FormValues = {
    username: '',
    password: '',
    address: [],
    date: null,
    customize: '',
    avatar: '',
    files: [],
    cover: [],
    agreement: false,
    type: ''
  }
  res = Object.assign({}, res, values)
  return res;
}

function User() {

  // 表单实例
  const [form] = Form.useForm()
  // 自定义校验状态
  const [customizeValidate, setCustomizeValidate] = useState<CustValidate>({
    validateStatus: ''
  })
  // 自定义校验定时器
  const [validteTimer, setValidateTimer] = useState<NodeJS.Timeout | null>(null)
  // 头像
  const [avatar, setAvatar] = useState<string | undefined>('')
  // 头像是否是上传中
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false)
  // 表单初始值
  const [formInitValues, setFormInitValues] = useState<FormValues>({})
  // 请求数据 loading
  const [loading, setLoading] = useState<boolean>(false)
  // 提交中
  const [submitting, setSubmitting] = useState<boolean>(false)
  // 不受代理的 cover
  const [coverList, setCoverList] = useState<any>([])

  // 自定义校验输入框触发 change 事件
  const handleCustomizeInputChange = async () => {
    const inputValue = form.getFieldValue('customize')
    let tempValid = {...customizeValidate}
    if (!inputValue.trim()) {
      tempValid.validateStatus = ''
      tempValid.help = ''
      setCustomizeValidate(tempValid)
      return ;
    }
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,16}$/
    tempValid.validateStatus = 'validating'
    setCustomizeValidate(tempValid)
    // 做个延迟，模拟校验
    await new Promise(resolve => {
      if (validteTimer) {
        clearTimeout(validteTimer)
      }
      setValidateTimer(setTimeout(resolve, 500))
    })
    if (reg.test(inputValue)) {
      if (inputValue.length < 6) {
        tempValid.validateStatus = 'warning'
        tempValid.help = '输入长度过短可能不安全'
      } else {
        tempValid.validateStatus = 'success'
        tempValid.help = ''
      }
    } else {
      tempValid.validateStatus = 'error'
      tempValid.help = '请输入1~16位英文和数字的组合'
    }
    setCustomizeValidate(tempValid)
    setValidateTimer(null)
  }

  // 获取被 Form 组件代理过的 fileList
  const normFile = (e: any) => {
    console.log('uplaod event',e)
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // 通过 file 获取图片 base64
  const getBase64 = (file: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // 校验图片上传
  const beforeImageUpload = (file: File, size?: number) => {
    const maxSize = size || 5;
    const imgType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp']
    const isImage = imgType.includes(file.type)
    if (!isImage) {
      message.error('You can only upload Image!');
    }
    const isLt2M = file.size / 1024 / 1024 < maxSize;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    return isImage && isLt2M
  }

  // 头像上传
  const handleAvatarChange = async (info: any) => {
    console.log('文件上传进度信息 >>>>>>', info)
    if (info?.file?.status === 'loading') {
      setAvatarUploading(true)
      return ;
    }
    if (info?.file?.status === 'done' || info?.file?.status === 'error') {
      const url = await getBase64(info?.file?.originFileObj)
      setAvatar(url)
      setAvatarUploading(false)
    }
  }

  // 不受控封面上传
  const handleCoverChange = async (info:any) => {
    // 判断是否处于完成状态 成功或失败移除都算完成
    setCoverList(info.fileList)
  }

  // 格式化上传组件的 fileList
  const handleFormatFile = async (files: any[]) => {
    let res = new Array(files.length)
    for (let i = 0; i < files.length; i ++) {
      const item = files[i]
      const url = item?.originFileObj ? await getBase64(item?.originFileObj) : item.url
      res[i] = {
        url,
        name: item.name,
        status: item.status || 'success'
      }
    }
    return res
  }

  const handleFormatForm = async () => {
    const values = form.getFieldsValue()
    // 处理头像
    values.avatar = await handleFormatFile(values.avatar.slice(-1))
    // 处理封面
    values.cover = await handleFormatFile(values.cover)
    // 处理文件
    values.files = await handleFormatFile(values.files)
    // 处理日期
    values.date = values.date.format('yyyy-MM-dd')
    return values
  }

  const onSubmit = async () => {
    const params = await handleFormatForm()
    setSubmitting(true)
    // 模拟提交请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 更新用户信息
    UserInfo.update({
      ...UserInfo.user,
      username: params.username,
      avatar: params.avatar
    })
    message.success('提交成功✔')
    setSubmitting(false)
    // 重新获取表单
    getList()
  }

  const onReset = () => {
    form.resetFields();
  }

  // 获取用户信息
  const getList = useCallback(
    async () => {
      setLoading(true)
      const initValues = getFormInitValues()
      await new Promise(resolve => setTimeout(resolve, 500))
      // 模拟请求到的数据
      initValues.username = UserInfo.user.username
      // 设置头像
      initValues.avatar = UserInfo.user.avatar
      setAvatar(UserInfo.user.avatar ? UserInfo.user.avatar : require('@/assets/avatar.webp'))
      // 设置封面
      initValues.cover = [
        {url: require('@/assets/avatar.webp'), name: 'login.webp'}
      ]
      // 设置不受控封面
      setCoverList([
        {url: require('@/assets/avatar.webp'), name: 'login.webp'}
      ])
      // 设置文件
      initValues.files = [
        {url: require('@/assets/avatar.webp'), name: 'login.webp'}
      ]
      // 设置时间
      initValues.date = moment(Date.now())
      setFormInitValues(initValues)
      form.setFieldsValue(initValues)
      setLoading(false)
    },
  [form])

  useEffect(() => {
    getList()
    // eslint-disable-next-line
  }, [])

  const uploadButton = (
    <div>
      {avatarUploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div>Upload</div>
    </div>
  );

  return (
    <Spin spinning={loading}>
      <Form
        className={style.form}
        name="form"
        form={form}
        labelWrap  // 长 label 会换行
        labelAlign='right'
        labelCol={{span: labelCol}}
        onFinish={onSubmit}
        initialValues={formInitValues}
      >

        <Form.Item name="username" label="用户名" rules={rules.username}>
          <Input placeholder='请输入用户名' allowClear />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="address"
          label="区域"
        >
          <Cascader options={addressOptions} />
        </Form.Item>

        <Form.Item name="type" label="类型">
          <Select>
            {
              selectOptions.map(item => {
                return (
                  <Option key={item.value} value={item.value}>{item.label}</Option>
                )
              })
            }
          </Select>
        </Form.Item>

        <Form.Item name="date" label="日期选择">
          <DatePicker placeholder='请选择日期' />
        </Form.Item>

        <Form.Item
          name="customize"
          label="动态校验"
          tooltip="请输入英文和数字的组合 1~16位 最好超过6位"
          hasFeedback
          {...customizeValidate}
        >
          <Input onChange={handleCustomizeInputChange} allowClear />
        </Form.Item>

        <Form.Item
          name="avatar"
          label="头像"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}  // 不展示上传列表
            action=""
            beforeUpload={(file: File) => beforeImageUpload(file, 5)}
            onChange={handleAvatarChange}
          >
            {
              avatar ? <img src={avatar} alt="avatar" style={{ width: '100%' }} /> : 
              uploadButton
            }
          </Upload>
        </Form.Item>

        <Form.Item
          name="cover"
          label="封面列表"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="cover"
            listType="picture-card"
            action=""
            beforeUpload={(file: File) => beforeImageUpload(file, 8)}
            onChange={() => null} // form 中的 cover 并不一定可以直接传给后端，需要处理格式
          >
            {form.getFieldValue('cover')?.length >= 5 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          name="onProxyCover"
          label="不通过Form代理fileList的封面列表"
        >
          <Upload
            name="onProxyCover"
            listType="picture-card"
            action=""
            fileList={coverList}
            beforeUpload={(file: File) => beforeImageUpload(file, 8)}
            onChange={handleCoverChange}
          >
            {coverList?.length >= 5 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          name="files"
          label="不限制格式和大小的列表"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="files"
            action=""
            onChange={() => null} // form 中的 cover 并不一定可以直接传给后端，需要处理格式
          >
            <Button>Upload File</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"  // 子节点的属性，一般是默认是 value，通过这个属性改变 checked
          rules={rules.agreement}
          wrapperCol={{offset: labelCol}}
        >
          <Checkbox>
            I have read the <a href='/'>agreement</a>
          </Checkbox>
        </Form.Item>

        <Form.Item className={style.eventBtGroup} wrapperCol={{offset: labelCol}}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default observer(User)
