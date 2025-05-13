import './index.scss'
import { Card, Form, Input, Button, message } from 'antd'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '@/store/modules/user'
import {useNavigate}from 'react-router-dom'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onFinish = async (values)=>{
    console.log(values);
    // 触发异步action fetchLogin
    await dispatch(fetchLogin(values))
    // 1、登录后跳转到首页
    navigate('/')
    // 2、提示用户是否登陆成功
    message.success('登陆成功')
  }
  return (
    <div className="login">
      <Card className="login-container">
        {/* <img className="login-logo" alt="" /> */}
        {/* 登录表单 */}
        <Form onFinish={onFinish} validateTrigger='onBlur'>
        <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' }
            ]}
          >
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' }
            ]}
          >
            <Input.Password size="large" placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login