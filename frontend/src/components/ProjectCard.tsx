import React from 'react'
import { Card, Tag, Space, Progress, Tooltip, Typography, Row, Col } from 'antd'
import { 
  CalendarOutlined, 
  FileTextOutlined, 
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { Project } from '../types/project'
import Button from './Button'

interface ProjectCardProps {
  project: Project
  onView?: (project: Project) => void
  onEdit?: (project: Project) => void
  listView?: boolean
}

const { Text } = Typography

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView, onEdit, listView = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#14B8A6'
      case 'in-progress': return '#3B82F6'
      case 'planning': return '#6366F1'
      case 'on-hold': return '#F97316'
      default: return '#6366F1'
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
      case 'urgent': return '#EF4444'
      case 'high': return '#F97316'
      case 'medium': return '#3B82F6'
      case 'low': return '#14B8A6'
      default: return '#6366F1'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const getProgress = () => {
    switch (project.status) {
      case 'completed': return 100
      case 'in-progress': return 50
      case 'planning': return 10
      case 'on-hold': return 30
      default: return 0
    }
  }

  // 列表视图渲染
  if (listView) {
    return (
      <Row gutter={[16, 16]} align="middle" style={{ width: '100%', padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
        <Col xs={24} sm={12} md={8}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{project.title}</h4>
          </div>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tag color={getPriorityColor(project.priority)}>
              {project.priority}
            </Tag>
            <Tag color={getStatusColor(project.status)}>
              {getStatusText(project.status)}
            </Tag>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Text>进度：</Text>
              <Text strong>{getProgress()}%</Text>
            </div>
            <Progress percent={getProgress()} size="small" showInfo={false} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} style={{ textAlign: 'right' }}>
          <Space>
            <Button 
              variant="text" 
              icon={<EyeOutlined />} 
              onClick={() => onView?.(project)}
            >
              查看
            </Button>
            <Button 
              variant="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit?.(project)}
            >
              编辑
            </Button>
          </Space>
        </Col>
      </Row>
    )
  }

  // 网格视图渲染
  return (
    <Card
      style={{ marginBottom: 16 }}
      actions={[
        <Tooltip title="查看详情">
          <Button 
            variant="text" 
            icon={<EyeOutlined />} 
            onClick={() => onView?.(project)}
          >
            查看
          </Button>
        </Tooltip>,
        <Tooltip title="编辑项目">
          <Button 
            variant="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit?.(project)}
          >
            编辑
          </Button>
        </Tooltip>
      ]}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
          {project.title}
        </h4>
        <Space>
          <Tag color={getPriorityColor(project.priority)}>
            {project.priority}
          </Tag>
          <Tag color={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Tag>
        </Space>
      </div>

      <p style={{ 
        color: '#666', 
        fontSize: '14px', 
        marginBottom: 12,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {project.description}
      </p>

      <div style={{ marginBottom: 12 }}>
        <Progress 
          percent={getProgress()} 
          size="small" 
          showInfo={false}
          strokeColor={{
            '0%': '#3B82F6',
            '100%': '#14B8A6',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size="small">
          <CalendarOutlined style={{ color: '#999' }} />
          <span style={{ fontSize: '12px', color: '#999' }}>
            {formatDate(project.createdAt)}
          </span>
        </Space>
        
        <Space size="small">
          <FileTextOutlined style={{ color: '#999' }} />
          <span style={{ fontSize: '12px', color: '#999' }}>
            {project.documents?.length || 0} 个文件
          </span>
        </Space>
      </div>

      {project.technologies && project.technologies.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <Space wrap size={[4, 4]}>
            {project.technologies.slice(0, 3).map((tech, index) => (
              <Tag key={index} color="#3B82F6">
                {tech}
              </Tag>
            ))}
            {project.technologies.length > 3 && (
              <Tag>+{project.technologies.length - 3}</Tag>
            )}
          </Space>
        </div>
      )}

      {project.tags && project.tags.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <Space wrap size={[4, 4]}>
            {project.tags.slice(0, 3).map((tag, index) => (
              <Tag key={index} color="#14B8A6">
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      )}
    </Card>
  )
}

export default ProjectCard