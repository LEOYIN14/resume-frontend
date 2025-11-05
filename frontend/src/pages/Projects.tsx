import React, { useEffect } from 'react'
import { Typography, Button, Space, Card, List, Tag, Empty, Spin } from 'antd'
import { PlusOutlined, CalendarOutlined, FileTextOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProjects } from '../store/slices/projectSlice'
import { RootState } from '../store/store'

const { Title } = Typography

const Projects: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projects, loading } = useSelector((state: RootState) => state.projects)

  useEffect(() => {
    dispatch(fetchProjects() as any)
  }, [dispatch])

  const handleCreateProject = () => {
    navigate('/projects/create')
  }

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }

  const handleEditProject = (projectId: string) => {
    console.log('编辑项目，ID:', projectId)
    navigate(`/projects/${projectId}/edit`)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>项目管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProject}>
          新建项目
        </Button>
      </div>
      
      {projects.length > 0 ? (
        <Card>
          <List
            dataSource={projects}
            renderItem={(project) => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewProject(project.id)}
                  >
                    查看
                  </Button>,
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={() => handleEditProject(project.id)}
                  >
                    编辑
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{project.title}</span>
                      <Tag color={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <p style={{ marginBottom: 8 }}>{project.description}</p>
                      <Space size="middle">
                        <Space size="small">
                          <CalendarOutlined style={{ color: '#999' }} />
                          <span style={{ fontSize: '12px', color: '#999' }}>
                            创建时间: {formatDate(project.createdAt)}
                          </span>
                        </Space>
                        <Space size="small">
                          <FileTextOutlined style={{ color: '#999' }} />
                          <span style={{ fontSize: '12px', color: '#999' }}>
                            技术栈: {project.technologies?.join(', ') || '无'}
                          </span>
                        </Space>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无项目数据"
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProject}>
            创建第一个项目
          </Button>
        </Empty>
      )}
    </div>
  )
}

export default Projects