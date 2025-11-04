import React from 'react'
import { Typography, Button, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title } = Typography

const Skills: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>技能管理</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          添加技能
        </Button>
      </div>
      
      <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
        <Space direction="vertical" size="large">
          <div>暂无技能数据</div>
          <Button type="primary" icon={<PlusOutlined />}>
            添加第一个技能
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Skills