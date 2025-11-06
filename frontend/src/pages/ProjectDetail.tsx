import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Tag, 
  Descriptions, 
  Divider, 
  List, 
  Typography,
  message,
  Spin
} from 'antd'
import { 
  ArrowLeftOutlined, 
  EditOutlined,
  FileOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { Project } from '../types/project'
import { fetchProjectById } from '../store/slices/projectSlice'

const { Title, Paragraph } = Typography

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [loading, setLoading] = useState(true)
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
        } else {
          // 如果store中没有，尝试从API获取
          const result = await dispatch(fetchProjectById(id) as any)
          if (result.payload) {
            setProject(result.payload)
          } else {
            message.error('项目不存在')
            navigate('/projects')
          }
        }
      } catch (error) {
        console.error('加载项目详情失败:', error)
        message.error('加载项目详情失败')
        navigate('/projects')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id, dispatch, navigate, projects])

  const handleEdit = () => {
    if (project) {
      navigate(`/projects/${project.id}/edit`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'processing'
      case 'planning': return 'default'
      case 'on-hold': return 'warning'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'in-progress': return '进行中'
      case 'planning': return '规划中'
      case 'on-hold': return '暂停中'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red'
      case 'high': return 'orange'
      case 'medium': return 'blue'
      case 'low': return 'green'
      default: return 'default'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return '紧急'
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return priority
    }
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
        <Title level={3}>项目不存在</Title>
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
          {/* 头部导航 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => {
                  // 检查是否有历史记录可以返回
                  if (window.history.length > 1) {
                    navigate(-1)
                  } else {
                    // 如果没有历史记录，返回项目列表页
                    navigate('/projects')
                  }
                }}
              >
                返回上一页
              </Button>
              <Divider type="vertical" />
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={handleEdit}
              >
                编辑项目
              </Button>
            </Space>
          </div>

          {/* 项目基本信息 */}
          <div>
            <Title level={2}>{project.title}</Title>
            <Space size="middle" style={{ marginBottom: 16 }}>
              <Tag color={getStatusColor(project.status)}>
                {getStatusText(project.status)}
              </Tag>
              <Tag color={getPriorityColor(project.priority)}>
                优先级: {getPriorityText(project.priority)}
              </Tag>
              {project.tags && project.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </Space>
          </div>

          {/* 详细描述 */}
          <Card title="项目描述" size="small">
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              {project.description}
            </Paragraph>
          </Card>

          {/* 项目信息表格 */}
          <Descriptions 
            title="项目信息" 
            bordered 
            column={2}
            size="middle"
          >
            <Descriptions.Item label="项目状态" span={1}>
              <Tag color={getStatusColor(project.status)}>
                {getStatusText(project.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="优先级" span={1}>
              <Tag color={getPriorityColor(project.priority)}>
                {getPriorityText(project.priority)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="开始时间" span={1}>
              <Space>
                <CalendarOutlined />
                {new Date(project.startDate).toLocaleDateString('zh-CN')}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="结束时间" span={1}>
              <Space>
                <CalendarOutlined />
                {project.endDate ? new Date(project.endDate).toLocaleDateString('zh-CN') : '未设置'}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={1}>
              <Space>
                <CalendarOutlined />
                {new Date(project.createdAt).toLocaleDateString('zh-CN')}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="更新时间" span={1}>
              <Space>
                <CalendarOutlined />
                {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
              </Space>
            </Descriptions.Item>
          </Descriptions>

          {/* 技术栈 */}
          {project.technologies && project.technologies.length > 0 && (
            <Card title="技术栈" size="small">
              <Space wrap>
                {project.technologies.map((tech, index) => (
                  <Tag key={index} color="blue">{tech}</Tag>
                ))}
              </Space>
            </Card>
          )}

          {/* 项目文件 */}
          {project.documents && project.documents.length > 0 && (
            <Card title="项目文件" size="small">
              <List
                dataSource={project.documents}
                renderItem={(doc) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<FileOutlined />}
                      title={
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          {doc.name}
                        </a>
                      }
                      description={`${doc.type} • ${(doc.size / 1024).toFixed(1)}KB • ${new Date(doc.uploadedAt).toLocaleDateString('zh-CN')}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Space>
      </Card>
    </div>
  )
}

export default ProjectDetail