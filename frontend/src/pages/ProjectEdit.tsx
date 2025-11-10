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
  Spin,
  Typography,
  Alert
} from 'antd'
import { 
  UploadOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Project } from '../types/project'
import { updateProject } from '../store/slices/projectSlice'
// 移除未使用的工具函数导入

const { TextArea } = Input
const { RangePicker } = DatePicker
const { Title } = Typography

const ProjectEdit: React.FC = () => {
  const [form] = Form.useForm()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fileList, setFileList] = useState<any[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string>('')
  const [formInitialized, setFormInitialized] = useState(false)
  
  // 数据加载逻辑 - 简化版本
  useEffect(() => {
    console.log('🔧 编辑页面开始加载，项目ID:', id)
    
    if (!id) {
      console.error('❌ 项目ID不存在')
      setError('项目ID不存在')
      message.error('项目ID不存在')
      setTimeout(() => navigate('/projects'), 1000)
      return
    }

    const loadProject = async () => {
      try {
        setLoading(true)
        setError('')
        // 移除未定义的诊断工具调用
        
        // 直接从localStorage获取项目数据
        const storedProjects = localStorage.getItem('projects')
        
        if (!storedProjects) {
          setError('没有找到项目数据，请先创建项目或初始化测试数据')
          message.error('没有找到项目数据')
          setLoading(false)
          return
        }
        
        const projects = JSON.parse(storedProjects)
        const foundProject = projects.find((p: Project) => p.id === id)
        
        if (!foundProject) {
          setError(`项目不存在，ID: ${id}`)
          message.error('项目不存在')
          setLoading(false)
          return
        }
        
        console.log('✅ 找到项目数据:', foundProject)
        setProject(foundProject)
        
        // 设置文件列表
        if (foundProject.documents && foundProject.documents.length > 0) {
          const files = foundProject.documents.map((doc: any) => ({
            uid: doc.id,
            name: doc.name,
            status: 'done',
            url: doc.url,
            size: doc.size
          }))
          setFileList(files)
        }
        
      } catch (error) {
        console.error('❌ 加载项目失败:', error)
        setError('加载项目失败: ' + (error as Error).message)
        message.error('加载项目失败')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id, navigate])
  
  // 当项目数据加载完成后，填充表单 - 简化版本
  useEffect(() => {
    if (project && !loading && !formInitialized) {
      console.log('🔄 开始填充表单数据')
      
      // 立即填充表单，不使用setTimeout
      try {
        const formValues = getFormValues(project)
        console.log('📋 表单初始值:', formValues)
        
        form.setFieldsValue(formValues)
        console.log('✅ 表单填充完成')
        setFormInitialized(true)
      } catch (formError) {
        console.error('❌ 表单填充失败:', formError)
        
        // 如果失败，使用更安全的方式
        setTimeout(() => {
          try {
            const formValues = getFormValues(project)
            form.resetFields()
            form.setFieldsValue(formValues)
            console.log('✅ 表单重新填充完成')
            setFormInitialized(true)
          } catch (secondError) {
            console.error('❌ 第二次表单填充失败:', secondError)
          }
        }, 100)
      }
    }
  }, [project, loading, form, formInitialized])

  const getFormValues = (projectData: Project) => {
    // 对于RangePicker，我们需要更加谨慎地处理日期
    // 当没有有效日期时，直接返回undefined，让RangePicker保持空白状态
    return {
      title: projectData.title || '',
      description: projectData.description || '',
      status: projectData.status || 'planning',
      priority: projectData.priority || 'medium',
      technologies: projectData.technologies || [],
      tags: projectData.tags || [],
      // 不设置period初始值，让RangePicker从空白状态开始
      // 这样可以避免日期格式不匹配导致的isValid is not a function错误
      period: undefined
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
        startDate: values.period && values.period[0] ? 
          typeof values.period[0] === 'string' ? values.period[0] : 
          values.period[0].toISOString ? values.period[0].toISOString() : new Date().toISOString() : 
          new Date().toISOString(),
        endDate: values.period && values.period[1] ? 
          typeof values.period[1] === 'string' ? values.period[1] : 
          values.period[1].toISOString ? values.period[1].toISOString() : undefined : 
          undefined,
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
      
      await dispatch(updateProject(projectData) as any)
      
      message.success('项目更新成功! 简历将自动更新')
      navigate(`/projects/${project.id}`)
    } catch (error) {
      console.error('❌ 更新项目失败:', error)
      message.error('更新项目失败，请重试')
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

  // 初始化测试数据（开发环境使用）
  const initTestData = () => {
    // 测试数据初始化
    const mockProjects = [
      {
        id: '1',
        title: '示例项目',
        description: '这是一个示例项目',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        technologies: ['React', 'TypeScript'],
        tags: ['示例', '测试'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('projects', JSON.stringify(mockProjects));
    message.success('测试数据初始化完成')
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  // 运行诊断工具
  const runDiagnostic = () => {
    if (id) {
      console.log(`诊断项目ID: ${id}`);
      // 检查localStorage中是否存在项目数据
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const projectExists = projects.some((p: any) => p.id === id);
        console.log(`项目存在: ${projectExists}`);
        return projectExists;
      }
      return false;
    }
  }

  // 强制刷新页面
  const forceRefresh = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载项目数据中...</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
          当前项目ID: {id}
        </div>
        {error && (
          <Alert 
            message="加载错误" 
            description={error} 
            type="error" 
            style={{ marginTop: 16, maxWidth: 400, margin: '16px auto' }}
          />
        )}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: 16 }}>
            <Button type="link" onClick={initTestData} style={{ marginRight: 8 }}>
              初始化测试数据
            </Button>
            <Button type="link" onClick={runDiagnostic} style={{ marginRight: 8 }}>
              运行诊断
            </Button>
            <Button type="link" onClick={forceRefresh}>
              强制刷新
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <Title level={3}>项目不存在</Title>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: 16 }}>
          项目ID: {id}
        </div>
        {error && (
          <Alert 
            message="错误信息" 
            description={error} 
            type="error" 
            style={{ marginBottom: 16, maxWidth: 400, margin: '0 auto' }}
          />
        )}
        <Button type="primary" onClick={() => navigate('/projects')} style={{ marginRight: 8 }}>
          返回项目列表
        </Button>
        {process.env.NODE_ENV === 'development' && (
          <>
            <Button type="link" onClick={initTestData} style={{ marginTop: 16, display: 'block' }}>
              初始化测试数据
            </Button>
            <Button type="link" onClick={runDiagnostic} style={{ marginTop: 8, display: 'block' }}>
              运行诊断工具
            </Button>
            <Button type="link" onClick={forceRefresh} style={{ marginTop: 8 }}>
              刷新页面
            </Button>
          </>
        )}
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
              onClick={() => {
                // 检查是否有历史记录可以返回
                if (window.history.length > 1) {
                  navigate(-1)
                } else {
                  // 如果没有历史记录，返回项目详情页
                  navigate(`/projects/${project.id}`)
                }
              }}
            >
              返回上一页
            </Button>
            <Title level={2} style={{ margin: '16px 0' }}>编辑项目</Title>
            {process.env.NODE_ENV === 'development' && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                项目ID: {project.id} | 项目标题: {project.title} | 表单状态: {formInitialized ? '已初始化' : '未初始化'}
              </div>
            )}
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
                    {/* <Select.Option value="urgent">紧急</Select.Option> */}
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