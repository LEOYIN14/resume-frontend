import React, { useEffect, useState } from 'react'
import { Typography, Button, Space, Card, List, Tag, Empty, Spin, Row, Col, Input, Select, Radio } from 'antd'
import { PlusOutlined, CalendarOutlined, FileTextOutlined, EyeOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProjects } from '../store/slices/projectSlice'
import { RootState } from '../store/store'
import ProjectCard from '../components/ProjectCard'

const { Title, Text } = Typography

const Projects: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projects, loading } = useSelector((state: RootState) => state.projects)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'title' | 'createdAt'>('createdAt')

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

  // 过滤和排序项目
  const filteredAndSortedProjects = React.useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchText.toLowerCase())
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // 排序
    filtered.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

    return filtered
  }, [projects, searchText, statusFilter, sortBy])

  // 移除未使用的Statistic组件

  // 添加CSS样式支持交互效果
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-search-input:focus-within .ant-input-prefix {
        color: #1890ff;
      }
      
      .custom-select.ant-select-focused {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
      
      .ant-radio-button-wrapper-checked {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
      }
      
      .ant-tag {
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .ant-tag:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .ant-tag-close-icon {
        transition: all 0.3s ease;
      }
      
      .ant-tag-close-icon:hover {
        transform: scale(1.2);
      }
      
      .custom-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      }
      
      .custom-input:focus {
        border-color: #1890ff !important;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="projects-page" style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>项目管理</Title>
      {/* 搜索和操作栏 */}
      <div style={{ marginBottom: '24px' }}>
        <Card style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
          {/* 已选筛选条件标签 */}
          {(searchText || statusFilter !== 'all' || sortBy !== 'createdAt') && (
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <Space size="small">
                {searchText && (
                  <Tag closable onClose={() => setSearchText('')} color="blue">
                    搜索: {searchText}
                  </Tag>
                )}
                {statusFilter !== 'all' && (
                  <Tag closable onClose={() => setStatusFilter('all')} color="green">
                    状态: {statusFilter === 'planning' ? '规划中' : 
                           statusFilter === 'in-progress' ? '进行中' : 
                           statusFilter === 'completed' ? '已完成' : '暂停中'}
                  </Tag>
                )}
                {sortBy !== 'createdAt' && (
                  <Tag closable onClose={() => setSortBy('createdAt')} color="purple">
                    排序: {sortBy === 'title' ? '按标题' : '按创建时间'}
                  </Tag>
                )}
                {(searchText || statusFilter !== 'all' || sortBy !== 'createdAt') && (
                  <Tag 
                    closable 
                    onClose={() => {
                      setSearchText('');
                      setStatusFilter('all');
                      setSortBy('createdAt');
                    }} 
                    color="default"
                  >
                    清空全部
                  </Tag>
                )}
              </Space>
            </div>
          )}
          
          <Row gutter={20} align="middle">
            <Col xs={24} lg={12}>
              <Space style={{ width: '100%' }}>
                <Input
                  placeholder="输入项目名称搜索..."
                  allowClear
                  style={{ 
                    flex: 1, 
                    transition: 'all 0.3s ease',
                    borderColor: '#d9d9d9'
                  }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined style={{ color: '#999', transition: 'color 0.3s' }} />}
                  className="custom-search-input custom-input"
                />
              </Space>
            </Col>
            <Col xs={24} lg={12}>
              <Row gutter={16} justify="end" align="middle">
                <Col>
                  <Space size="middle">
                    <Select 
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ 
                        width: 130,
                        transition: 'all 0.3s ease'
                      }} 
                      placeholder="按状态筛选"
                      showSearch
                      optionFilterProp="children"
                      className="custom-select"
                    >
                      <Select.Option value="all">全部</Select.Option>
                      <Select.Option value="planning">规划中</Select.Option>
                      <Select.Option value="in-progress">进行中</Select.Option>
                      <Select.Option value="completed">已完成</Select.Option>
                      <Select.Option value="on-hold">暂停中</Select.Option>
                    </Select>
                    
                    <Select 
                      value={sortBy}
                      onChange={(value) => setSortBy(value as 'title' | 'createdAt')}
                      style={{ 
                        width: 130,
                        transition: 'all 0.3s ease'
                      }} 
                      placeholder="排序方式"
                      className="custom-select"
                    >
                      <Select.Option value="title">标题</Select.Option>
                      <Select.Option value="createdAt">创建时间</Select.Option>
                    </Select>
                    
                    <Radio.Group 
                      value={viewMode} 
                      onChange={(e) => setViewMode(e.target.value)}
                      buttonStyle="solid"
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      <Radio.Button value="grid" style={{ transition: 'all 0.3s ease' }}>网格</Radio.Button>
                      <Radio.Button value="list" style={{ transition: 'all 0.3s ease' }}>列表</Radio.Button>
                  </Radio.Group>
                    
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleCreateProject} 
                      size="middle"
                      style={{ 
                        transition: 'all 0.3s ease',
                        transform: 'translateY(0)'
                      }}
                      className="custom-button"
                    >
                      创建项目
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </div>
      
      {/* 结果统计 */}
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary">找到 {filteredAndSortedProjects.length} 个项目</Text>
      </div>
      
      {filteredAndSortedProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <Row gutter={[16, 16]}>
            {filteredAndSortedProjects.map(project => (
              <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
                <ProjectCard 
                  project={project}
                  onView={() => handleViewProject(project.id)}
                  onEdit={() => handleEditProject(project.id)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Card>
            <List
              dataSource={filteredAndSortedProjects}
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
        )
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