import React, { useState } from 'react'
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Row, 
  Col, 
  DatePicker, 
  Select, 
  Upload, 
  message,
  Space,
  Divider
} from 'antd'
import { 
  UploadOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Project } from '../types/project'
import { createProject } from '../store/slices/projectSlice'

const { TextArea } = Input
const { RangePicker } = DatePicker

const ProjectCreate: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [fileList, setFileList] = useState<any[]>([])

  const onFinish = async (values: any) => {
    try {
      const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority || 'medium',
        technologies: values.technologies || [],
        tags: values.tags || [],
        startDate: values.period ? values.period[0].toISOString() : new Date().toISOString(),
        endDate: values.period ? values.period[1].toISOString() : undefined,
        documents: fileList.map(file => ({
          id: file.uid,
          name: file.name,
          type: 'other',
          url: file.url || '',
          size: file.size,
          uploadedAt: new Date().toISOString()
        }))
      }
      
      // 调用Redux action保存项目数据
      await dispatch(createProject(projectData) as any)
      
      message.success('项目创建成功!')
      navigate('/projects')
    } catch (error) {
      console.error('创建项目失败:', error)
      message.error('创建项目失败')
    }
  }

  const uploadProps = {
    beforeUpload: (file: any) => {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('文件大小不能超过10MB!')
        return false
      }
      return true
    },
    onChange: (info: any) => {
      setFileList(info.fileList)
    },
    multiple: true
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/projects')}
            >
              返回项目列表
            </Button>
            <h2 style={{ margin: '16px 0' }}>创建新项目</h2>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="项目标题"
                  rules={[{ required: true, message: '请输入项目标题' }]}
                >
                  <Input placeholder="请输入项目标题" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="项目状态"
                  rules={[{ required: true, message: '请选择项目状态' }]}
                >
                  <Select placeholder="请选择项目状态">
                    <Select.Option value="planning">规划中</Select.Option>
                    <Select.Option value="in-progress">进行中</Select.Option>
                    <Select.Option value="completed">已完成</Select.Option>
                    <Select.Option value="on-hold">暂停中</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="项目描述"
              rules={[{ required: true, message: '请输入项目描述' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="请输入项目详细描述，包括项目目标、功能特点等" 
              />
            </Form.Item>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="period"
                  label="项目周期"
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="priority"
                  label="优先级"
                >
                  <Select placeholder="请选择优先级">
                    <Select.Option value="low">低</Select.Option>
                    <Select.Option value="medium">中</Select.Option>
                    <Select.Option value="high">高</Select.Option>
                    <Select.Option value="urgent">紧急</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="technologies"
              label="技术栈"
            >
              <Select 
                mode="tags" 
                placeholder="请输入使用的技术栈"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="tags"
              label="项目标签"
            >
              <Select 
                mode="tags" 
                placeholder="请输入项目标签"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Divider>项目文件</Divider>

            <Form.Item label="上传项目文件">
              <Upload {...uploadProps} fileList={fileList}>
                <Button icon={<UploadOutlined />}>选择文件</Button>
                <span style={{ marginLeft: 8 }}>
                  支持上传文档、图片、代码文件等（单个文件不超过10MB）
                </span>
              </Upload>
            </Form.Item>

            <Form.Item style={{ marginTop: 32, textAlign: 'center' }}>
              <Space size="large">
                <Button size="large" onClick={() => navigate('/projects')}>
                  取消
                </Button>
                <Button type="primary" size="large" htmlType="submit">
                  创建项目
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default ProjectCreate