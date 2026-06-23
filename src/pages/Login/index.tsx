import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, Message } from '@arco-design/web-react'
import { IconLock, IconUser } from '@arco-design/web-react/icon'
import { useAuthStore } from '../../store/auth'

const { Title } = Typography
const FormItem = Form.Item

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      await login(values.username, values.password)
      Message.success('登录成功')
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
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{ width: 400, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title heading={4} style={{ margin: 0 }}>学校管理系统</Title>
          <div style={{ color: 'var(--color-text-3)', marginTop: 4 }}>请输入账号和密码登录</div>
        </div>
        <Form layout="vertical" onSubmit={handleSubmit} autoComplete="off">
          <FormItem
            label="账号"
            field="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<IconUser />} placeholder="请输入账号" size="large" />
          </FormItem>
          <FormItem
            label="密码"
            field="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<IconLock />}
              placeholder="请输入密码"
              size="large"
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              long
              size="large"
              loading={loading}
            >
              登 录
            </Button>
          </FormItem>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            还没有账号？<Link to="/register">申请账号</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
