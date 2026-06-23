import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, Message } from '@arco-design/web-react'
import { IconLock, IconUser } from '@arco-design/web-react/icon'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/auth'

const { Title } = Typography
const FormItem = Form.Item

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (values: { username: string; password: string; confirmPassword: string; nickname: string }) => {
    if (values.password !== values.confirmPassword) {
      Message.error('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.register({
        username: values.username,
        password: values.password,
        nickname: values.nickname,
      })
      const data = res.data
      setAuth(data.accessToken, data.refreshToken, data.username, data.nickname)
      Message.success('注册成功')
      navigate('/college')
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{ width: 400, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title heading={4} style={{ margin: 0 }}>申请账号</Title>
          <div style={{ color: 'var(--color-text-3)', marginTop: 4 }}>注册后自动登录</div>
        </div>
        <Form layout="vertical" onSubmit={handleSubmit} autoComplete="off">
          <FormItem
            label="账号"
            field="username"
            rules={[
              { required: true, message: '请输入账号' },
              { minLength: 3, message: '账号至少3个字符' },
              { maxLength: 20, message: '账号最多20个字符' },
            ]}
          >
            <Input prefix={<IconUser />} placeholder="请输入账号" size="large" />
          </FormItem>
          <FormItem
            label="昵称"
            field="nickname"
            rules={[{ maxLength: 20, message: '昵称最多20个字符' }]}
          >
            <Input prefix={<IconUser />} placeholder="请输入昵称（可选）" size="large" />
          </FormItem>
          <FormItem
            label="密码"
            field="password"
            rules={[
              { required: true, message: '请输入密码' },
              { minLength: 6, message: '密码至少6个字符' },
              { maxLength: 20, message: '密码最多20个字符' },
            ]}
          >
            <Input.Password prefix={<IconLock />} placeholder="请输入密码" size="large" />
          </FormItem>
          <FormItem
            label="确认密码"
            field="confirmPassword"
            rules={[{ required: true, message: '请再次输入密码' }]}
          >
            <Input.Password prefix={<IconLock />} placeholder="请再次输入密码" size="large" />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              long
              size="large"
              loading={loading}
            >
              注 册
            </Button>
          </FormItem>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            已有账号？<Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
