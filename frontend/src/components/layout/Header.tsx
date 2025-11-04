import React from 'react'
import { Layout, Typography, Space, Button, Avatar } from 'antd'
import { UserOutlined, SettingOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout
const { Title } = Typography

const Header: React.FC = () => {
  return (
    <AntHeader 
      style={{ 
        background: '#fff', 
        padding: '0 24px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Space>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          LEO的工作知识库
        </Title>
      </Space>
      
      <Space>
        <Button type="text" icon={<SettingOutlined />}>
          设置
        </Button>
        <Avatar icon={<UserOutlined />} />
      </Space>
    </AntHeader>
  )
}

export default Header