import React from 'react'
import { Layout, Menu } from 'antd'
import { 
  DashboardOutlined, 
  ProjectOutlined, 
  FileTextOutlined, 
  ToolOutlined,
  SettingOutlined 
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目管理',
    },
    {
      key: '/resume',
      icon: <FileTextOutlined />,
      label: '简历生成',
    },
    {
      key: '/skills',
      icon: <ToolOutlined />,
      label: '技能管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ]

  return (
    <Sider 
      width={200} 
      style={{ 
        background: '#fff',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
      }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}

export default Sidebar