import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Typography, Avatar, Dropdown, Space } from '@arco-design/web-react'
import {
  IconBook,
  IconDesktop,
  IconEdit,
  IconMenuFold,
  IconMenuUnfold,
  IconPoweroff,
  IconStorage,
  IconUser,
  IconUserGroup,
} from '@arco-design/web-react/icon'
import { useAuthStore } from '../store/auth'

const { Sider, Header, Content } = Layout
const { Title } = Typography

const menuItems = [
  { key: '/college', icon: <IconStorage />, label: '学院管理' },
  { key: '/classroom', icon: <IconUserGroup />, label: '班级管理' },
  { key: '/student', icon: <IconUser />, label: '学生管理' },
  { key: '/teacher', icon: <IconUserGroup />, label: '教师管理' },
  { key: '/course', icon: <IconBook />, label: '课程管理' },
  { key: '/score', icon: <IconEdit />, label: '成绩管理' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { nickname, username, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const selectedKey = '/' + location.pathname.split('/')[1]

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={220}
        style={{ borderRight: '1px solid var(--color-border)' }}
      >
        <div
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <IconDesktop style={{ fontSize: 20, color: 'rgb(var(--primary-6))' }} />
          {!collapsed && (
            <Title heading={6} style={{ margin: '0 0 0 8px', whiteSpace: 'nowrap' }}>
              学校管理系统
            </Title>
          )}
        </div>
        <Menu
          selectedKeys={[selectedKey]}
          onClickMenuItem={(key) => navigate(key)}
          style={{ width: '100%' }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>
              {item.icon} {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg-1)',
          }}
        >
          <div
            style={{ cursor: 'pointer', fontSize: 18 }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
          </div>
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="logout" onClick={handleLogout}>
                  <IconPoweroff /> 退出登录
                </Menu.Item>
              </Menu>
            }
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={28} style={{ backgroundColor: 'rgb(var(--primary-6))' }}>
                {(nickname || username || 'U')[0].toUpperCase()}
              </Avatar>
              <span>{nickname || username}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ padding: 16, overflow: 'auto', background: 'var(--color-bg-1)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
