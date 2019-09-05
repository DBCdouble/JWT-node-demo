import React from 'react'
import { Button, Input, Icon, Form, Card, message } from 'antd'
import axios from 'axios'
import JSEncrypt from 'jsencrypt'
import { PUB_KEY } from '../../../universal/variable'
import './index.less'

function Login ({ history, form }) {
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const { username, password } = values;
        console.log(values)
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(PUB_KEY);
        const params = {
          username,
          password: encrypt.encrypt(password)
        }
        axios.post(`/api/user/login`, params)
        .then(({ data }) => {
          if (data.code === 0) {
            message.success('登录成功')
            history.push({ pathname: '/home', state: { username } })
          }
        })
      }
    })
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 0,
      },
    },
  };
  const {
    getFieldDecorator
  } = form
  return (
    <React.Fragment>
      <div className='login-container'>
        <Card title="登录" bordered={ false } className='login-content'>
          <Form { ...formItemLayout } onSubmit={ handleSubmit }>
            <Form.Item label='用户名' hasFeedback>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入您的用户名！' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username" 
                />
              )}
            </Form.Item>
            <Form.Item label='密码' hasFeedback>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入您的密码！' }],
              })(
                <Input
                  type="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="password" 
                  
                />
              )}
            </Form.Item>
            <Form.Item { ...tailFormItemLayout } hasFeedback>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </React.Fragment>
  )
}
export default Form.create()(Login)