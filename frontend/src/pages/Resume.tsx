import React from 'react'
import { Typography, Button, Space, Card } from 'antd'
import { FileSyncOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Resume: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>简历生成</Title>
        <Button type="primary" icon={<FileSyncOutlined />}>
          AI生成简历
        </Button>
      </div>
      
      <Card>
        <div style={{ textAlign: 'center', color: '#999', padding: '60px 0' }}>
          <Space direction="vertical" size="large">
            <FileSyncOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <div>
              <Paragraph>尚未生成简历</Paragraph>
              <Paragraph type="secondary">
                点击上方按钮使用AI智能生成您的个性化简历
              </Paragraph>
            </div>
            <Button type="primary" size="large" icon={<FileSyncOutlined />}>
              开始生成简历
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  )
}

export default Resume