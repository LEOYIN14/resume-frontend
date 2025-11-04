import React, { useEffect } from 'react'
import { Row, Col, Card, Statistic, Typography, Button, Empty } from 'antd'
import { ProjectOutlined, ToolOutlined, FileTextOutlined, RocketOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ProjectCard from '../components/ProjectCard'
import { Project } from '../types/project'
import { fetchProjects } from '../store/slices/projectSlice'
import { RootState } from '../store/store'

const { Title } = Typography

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projects, loading } = useSelector((state: RootState) => state.projects)

  useEffect(() => {
    dispatch(fetchProjects() as any)
  }, [dispatch])

  const handleCreateProject = () => {
    navigate('/projects/create')
  }

  const handleViewProject = (project: Project) => {
    // 跳转到项目详情页面
    navigate(`/projects/${project.id}`)
  }

  const handleEditProject = (project: Project) => {
    // 跳转到项目编辑页面
    navigate(`/projects/${project.id}/edit`)
  }

  return (
    <div>
      <Title level={2}>工作台</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="项目总数"
              value={projects.length}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="进行中项目"
              value={projects.filter(p => p.status === 'in-progress').length}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已完成项目"
              value={projects.filter(p => p.status === 'completed').length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总文件数"
              value={projects.reduce((total, p) => total + (p.documents?.length || 0), 0)}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>最近项目</span>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProject}>
                  新建项目
                </Button>
              </div>
            }
          >
            {projects.length > 0 ? (
              <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                {projects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onView={handleViewProject}
                    onEdit={handleEditProject}
                  />
                ))}
              </div>
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
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="项目状态分布" style={{ height: 400 }}>
            <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
              项目状态统计图表
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard