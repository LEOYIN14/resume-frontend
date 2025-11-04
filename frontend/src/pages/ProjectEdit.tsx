import React, { useState, useEffect } from 'react'
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
  Divider,
  Spin
} from 'antd'
import { 
  UploadOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { Project } from '../types/project'
import { fetchProjectById, updateProject } from '../store/slices/projectSlice'

const { TextArea } = Input
const { RangePicker } = DatePicker

const ProjectEdit: React.FC = () => {
  const [form] = Form.useForm()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fileList, setFileList] = useState<any[]>([])
  const [project, setProject] = useState<Project | null>(null)
  
  const projects = useSelector((state: RootState) => state.projects.projects)

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        message.error('项目ID不存在')
        navigate('/projects')
        return
      }

      try {
        setLoading(true)
        
        // 首先从Redux store中查找项目
        const existingProject = projects.find(p => p.id === id)
        if (existingProject) {
          setProject(existingProject)
          populateForm(existingProject)
        } else {
          // 如果store中没有，尝试从API获取
          const result = await dispatch(fetchProjectById(id) as any)
          if (result.payload) {
            setProject(result.payload)
            populateForm(result.payload)
          } else {
            message.error('项目不存在')
            navigate('/projects')
          }
        }
      } catch (error) {
        console.error('加载项目失败:', error)
        message.error('加载项目失败')
        navigate('/projects')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id, dispatch, navigate, projects])

  const populateForm = (projectData: Project) => {
    form.setFieldsValue({
      title: projectData.title,
      description: projectData.description,
      status: projectData.status,
      priority: projectData.priority,
      technologies: projectData.technologies || [],
      tags: projectData.tags || [],
      period: projectData.endDate 
        ? [
            projectData.startDate ? new Date(projectData.startDate) : null,
            projectData.endDate ? new Date(projectData.endDate) : null
          ]
        : projectData.startDate ? [new Date(projectData.startDate), null] : null
    })

    // 设置文件列表
    if (projectData.documents && projectData.documents.length > 0) {
      const files = projectData.documents.map(doc => ({
        uid: doc.id,
        name: doc.name,
        status: 'done',
        url: doc.url,
        size: doc.size
      }))
      setFileList(files)
    }
  }

  const onFinish = async (values: any) => {
    if (!project) return

    try {
      setSubmitting(true)
      
      const projectData: Project = {
        ...project,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        technologies: values.technologies || [],
        tags: values.tags || [],
        startDate: values.period ? values.period[0].toISOString() : new Date().toISOString(),
        endDate: values.period ? values.period[1]?.toISOString() : undefined,
        documents: fileList.map(file => ({
          id: file.uid,
          name: file.name,
          type: 'other',
          url: file.url || '',
          size: file.size,
          uploadedAt: new Date().toISOString()
        })),
        updatedAt: new Date().toISOString()
      }
      
      // 调用Redux action更新项目数据
      await dispatch(updateProject(projectData) as any)
      
      message.success('项目更新成功!')
      navigate(`/projects/${project.id}`)
    } catch (error) {
      console.error('更新项目失败:', error)
      message.error('更新项目失败')
    } finally {
      setSubmitting(false)
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

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载中...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>项目不存在</h2>
        <Button type="primary" onClick={() => navigate('/projects')}>
          返回项目列表
        </Button>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              返回项目详情
            </Button>
            <h2 style={{ margin: '16px 0' }}>编辑项目</h2>
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
                <Button 
                  size="large" 
                  onClick={() => navigate(`/projects/${project.id}`)}
                  disabled={submitting}
                >
                  取消
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  htmlType="submit"
                  loading={submitting}
                >
                  保存修改
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default ProjectEdit