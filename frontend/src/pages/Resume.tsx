import React, { useState, useEffect } from 'react'
import { Typography, Button, Space, Card, message, Dropdown } from 'antd'
import { FileSyncOutlined, DownloadOutlined, DownOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import ResumeTemplateSelector from '../components/resume-templates/ResumeTemplateSelector'
import ResumeExporter from '../utils/resumeExporter'
import { fetchProjects } from '../store/slices/projectSlice'
import type { Resume, ProjectReference } from '../types/resume'
import type { Project } from '../types/project'
import type { RootState } from '../store/store'

const { Title } = Typography

// 基础简历数据模板
const baseResumeData: Omit<Resume, 'projects'> = {
  id: '1',
  personalInfo: {
    name: '姓名',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    photo: '',
    gender: '性别',
    age: '年龄',
    hometown: '籍贯',
    height: '身高',
    marriageStatus: '婚姻状况',
    politicalStatus: '政治面貌'
  },
  experiences: [
    {
      id: 'exp1',
      company: '某科技公司',
      position: '高级前端开发工程师',
      startDate: '2022-01-01',
      endDate: 'present',
      description: '负责公司核心产品的前端开发和架构设计，参与技术选型和团队管理。',
      achievements: [
        '重构了公司官网，提升了页面加载速度30%',
        '主导了组件库的建设，提高了团队开发效率',
        '设计并实现了响应式布局，支持多端访问'
      ],
      technologies: ['React', 'TypeScript', 'Ant Design', 'Webpack']
    },
    {
      id: 'exp2',
      company: '互联网创业公司',
      position: '前端开发工程师',
      startDate: '2020-06-01',
      endDate: '2021-12-31',
      description: '参与公司产品的前端开发，负责用户界面实现和交互逻辑开发。',
      achievements: [
        '开发了数据可视化图表组件，提升了数据展示效果',
        '优化了前端性能，减少了页面加载时间'
      ],
      technologies: ['Vue', 'JavaScript', 'Element UI']
    }
  ],
  education: [
    {
      id: 'edu1',
      institution: '某重点大学',
      degree: '学士',
      field: '计算机科学与技术',
      startDate: '2016-09-01',
      endDate: '2020-06-30',
      gpa: 3.8,
      description: '主修计算机科学基础课程，辅修软件工程。'
    }
  ],
  skills: [
    { id: 'skill1', name: 'React', category: '前端框架', level: 'expert', years: 5 },
    { id: 'skill2', name: 'TypeScript', category: '编程语言', level: 'advanced', years: 4 },
    { id: 'skill3', name: 'Ant Design', category: 'UI组件', level: 'advanced', years: 3 },
    { id: 'skill4', name: 'Webpack', category: '构建工具', level: 'intermediate', years: 3 },
    { id: 'skill5', name: 'HTML5', category: '前端技术', level: 'expert', years: 5 },
    { id: 'skill6', name: 'CSS3', category: '前端技术', level: 'advanced', years: 4 },
    { id: 'skill7', name: '响应式设计', category: '设计技能', level: 'advanced', years: 4 },
    { id: 'skill8', name: 'Git', category: '开发工具', level: 'intermediate', years: 4 },
    { id: 'skill9', name: '前端性能优化', category: '专业技能', level: 'advanced', years: 3 },
    { id: 'skill10', name: '单元测试', category: '测试技能', level: 'intermediate', years: 2 }
  ],
  summary: '资深前端开发者，专注于创建高质量的用户体验和可维护的代码。拥有丰富的React生态系统开发经验，善于解决复杂的前端架构问题。',
  template: 'modern',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString()
};

// 将项目数据转换为简历项目引用格式
const convertProjectsToResumeFormat = (projects: Project[]): ProjectReference[] => {
  // 项目角色映射（可以根据项目特征智能分配角色）
  const roleMap: { [key: string]: string } = {
    '个人简历管理系统': '项目负责人',
    'AI营销实验室': '核心开发者'
  };
  
  // 复制并按日期排序项目数据（最新的项目在前）
  const sortedProjects = [...projects].sort((a, b) => {
    // 优先使用endDate排序，如果没有endDate则使用startDate
    const getSortDate = (project: Project) => {
      // 没有endDate的项目（进行中）应该排在前面
      if (!project.endDate) return new Date().getTime();
      return new Date(project.endDate).getTime();
    };
    
    return getSortDate(b) - getSortDate(a);
  });
  
  return sortedProjects.map(project => {
    // 格式化项目时间
    const formatDate = (dateString?: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    };
    
    const startDate = formatDate(project.startDate);
    const endDate = project.endDate ? formatDate(project.endDate) : '至今';
    const dateRange = startDate ? `${startDate} - ${endDate}` : '';
    
    return {
      projectId: project.id,
      title: project.title || '项目',
      role: roleMap[project.title] || '开发者',
      contribution: project.description || '',
      date: dateRange,
      highlights: [
        // 从项目数据中提取关键亮点
        `使用 ${project.technologies?.join(', ')} 技术栈开发`,
        `项目状态: ${getStatusText(project.status)}`,
        project.tags?.length > 0 ? `关键词: ${project.tags.join(', ')}` : undefined
      ].filter(Boolean) as string[]
    };
  });
};

// 获取项目状态的中文文本
const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'planning': '规划中',
    'in-progress': '进行中',
    'completed': '已完成',
    'on-hold': '已暂停'
  };
  return statusMap[status] || status;
}

const Resume: React.FC = () => {
  const dispatch = useDispatch()
  const { projects, loading: projectsLoading } = useSelector((state: RootState) => state.projects)
  
  const [resume, setResume] = useState<Resume | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('standard')
  const [loading, setLoading] = useState(false)

  // 初始化时加载项目数据
  useEffect(() => {
    dispatch(fetchProjects() as any)
  }, [dispatch])

  // 处理照片变更
  const handlePhotoChange = (newPhoto: string) => {
    if (resume) {
      const updatedResume = {
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          photo: newPhoto
        }
      }
      setResume(updatedResume)
    }
  }

  // 当项目数据变化时，自动更新简历
  useEffect(() => {
    if (projects.length > 0) {
      const resumeProjects = convertProjectsToResumeFormat(projects)
      const updatedResume: Resume = {
        ...baseResumeData,
        projects: resumeProjects,
        updatedAt: new Date().toISOString()
      }
      setResume(updatedResume)
    } else if (!projectsLoading) {
      // 如果没有项目数据，使用基础模板
      const updatedResume: Resume = {
        ...baseResumeData,
        projects: [],
        updatedAt: new Date().toISOString()
      }
      setResume(updatedResume)
    }
  }, [projects, projectsLoading])

  const handleGenerateResume = async () => {
    setLoading(true)
    try {
      // 重新获取最新的项目数据
      await dispatch(fetchProjects() as any)
      message.success('简历已更新')
    } catch (error) {
      message.error('简历更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 下载功能已通过Dropdown组件直接实现

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>简历生成</Title>
        <Space>
          <Button 
            type="primary" 
            icon={<FileSyncOutlined />} 
            loading={loading} 
            onClick={handleGenerateResume}
            style={{
              padding: '6px 16px',
              fontSize: '14px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)',
              transition: 'all 0.3s ease'
            }}
            danger={false}
          >
            AI生成简历
          </Button>
          {resume && (
            <Dropdown menu={{
                items: [
                  {
                    key: 'pdf',
                    label: '导出PDF',
                    onClick: () => resume && ResumeExporter.exportResume(resume, selectedTemplate, 'pdf')
                  },
                  {
                    key: 'html',
                    label: '导出HTML',
                    onClick: () => resume && ResumeExporter.exportResume(resume, selectedTemplate, 'html')
                  },
                  {
                    key: 'text',
                    label: '导出文本',
                    onClick: () => resume && ResumeExporter.exportResume(resume, selectedTemplate, 'text')
                  }
                ]
              }}>
                <Button 
                  type="default" 
                  icon={<DownloadOutlined />}
                  style={{
                    padding: '6px 16px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    borderColor: '#d9d9d9',
                    transition: 'all 0.3s ease'
                  }}

                >
                  下载简历 <DownOutlined />
                </Button>
              </Dropdown>
          )}
        </Space>
      </div>
      

      
      {resume ? (
        <ResumeTemplateSelector
          resume={resume}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          onPhotoChange={handlePhotoChange}
        />
      ) : (
        <Card>
          <div style={{ textAlign: 'center', color: '#999', padding: '60px 0' }}>
            <Space direction="vertical" size="large">
              <FileSyncOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
              <div>
                <Title level={4}>尚未生成简历</Title>
                <p style={{ color: '#666' }}>
                  点击上方按钮使用AI智能生成您的个性化简历
                </p>
              </div>
              <Button 
                type="primary" 
                size="large" 
                icon={<FileSyncOutlined />} 
                onClick={handleGenerateResume}
                style={{
                  padding: '10px 24px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(52, 152, 219, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                开始生成简历
              </Button>
            </Space>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Resume