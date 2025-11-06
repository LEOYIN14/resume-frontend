import React from 'react'
import { Typography, Card, Form, Input, Button, Switch } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const { Title } = Typography

const Settings: React.FC = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('Settings saved:', values)
  }

  return (
    <div>
      <Title level={2}>系统设置</Title>
      
      <Card title="AI配置" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="DeepSeek API Key"
            name="apiKey"
            rules={[{ required: true, message: '请输入API Key' }]}
          >
            <Input.Password placeholder="输入您的DeepSeek API密钥" />
          </Form.Item>
          
          <Form.Item
            label="API Base URL"
            name="baseUrl"
            initialValue="https://api.deepseek.com"
          >
            <Input placeholder="API基础地址" />
          </Form.Item>
          
          <Form.Item
            label="启用AI功能"
            name="aiEnabled"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card title="数据设置">
        <Form layout="vertical">
          <Form.Item
            label="数据存储路径"
            name="dataPath"
            initialValue="./data"
          >
            <Input placeholder="数据存储目录" />
          </Form.Item>
          
          <Form.Item
            label="自动备份"
            name="autoBackup"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          
          <Button type="primary" icon={<SaveOutlined />}>
            保存数据设置
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default Settings