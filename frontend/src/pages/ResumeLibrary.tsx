import React, { useState, useEffect } from 'react'
import { Typography, Button, Table, Card, Space, Modal, message, Spin } from 'antd'
import { DownloadOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ResumeTemplate } from '../types/resume'

// 简历项类型定义
type ResumeItem = {
  resumeId: string;
  id: string;
  name: string;
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    photo: string;
    gender: string;
    age: string;
    hometown: string;
    height: string;
    marriageStatus: string;
    politicalStatus: string;
  };
  summary: string;
  template: ResumeTemplate;
  projects: any[];
  createdAt: string;
  updatedAt: string;
  experiences: any[];
  education: any[];
  skills: any[];
  displayDate: string;
}
import ResumeExporter from '../utils/resumeExporter'
import StandardResumeTemplate from '../components/resume-templates/StandardResumeTemplate'

const { Title } = Typography
const { confirm } = Modal

// ResumeItem已经从types导入，这里不再需要重新定义

const ResumeLibrary: React.FC = () => {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [selectedResume, setSelectedResume] = useState<ResumeItem | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  // 从localStorage获取简历数据
  useEffect(() => {
    // 模拟加载延迟
    setTimeout(() => {
      try {
        // 从localStorage读取简历数据
        const storedResumes = localStorage.getItem('resumes')
        let resumesList: ResumeItem[] = []
        
        if (storedResumes) {
          resumesList = JSON.parse(storedResumes)
        } else {
          // 如果没有数据，提供一些示例数据
          resumesList = [
            {
              resumeId: '1',
              id: '1',
              name: '张三的简历',
              personalInfo: {
                name: '张三',
                title: '高级前端开发工程师',
                email: 'zhangsan@example.com',
                phone: '138****1234',
                location: '北京',
                bio: '',
                photo: '',
                gender: '男',
                age: '28',
                hometown: '河北',
                height: '178cm',
                marriageStatus: '未婚',
                politicalStatus: '中共党员'
              },
              experiences: [
                {
                  id: 'exp1',
                  company: '某科技公司',
                  position: '高级前端开发工程师',
                  startDate: '2022-01-01',
                  endDate: 'present',
                  description: '负责公司核心产品的前端开发和架构设计。',
                  achievements: ['重构了公司官网，提升了页面加载速度30%'],
                  technologies: ['React', 'TypeScript', 'Ant Design']
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
                  description: '主修计算机科学基础课程。'
                }
              ],
              skills: [
                { id: 'skill1', name: 'React', category: '前端框架', level: 'expert', years: 5 },
                { id: 'skill2', name: 'TypeScript', category: '编程语言', level: 'advanced', years: 4 }
              ],
              summary: '资深前端开发者，专注于创建高质量的用户体验。',
              template: 'standard' as ResumeTemplate,
              projects: [],
              createdAt: '2024-01-15T08:30:00Z',
              updatedAt: '2024-01-15T08:30:00Z',
              displayDate: '2024-01-15'
            }
          ]
          // 保存示例数据到localStorage
          localStorage.setItem('resumes', JSON.stringify(resumesList))
        }
        
        setResumes(resumesList)
      } catch (error) {
        console.error('获取简历列表失败:', error)
        message.error('加载简历列表失败')
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [])

  // 处理下载简历
  const handleDownload = (resume: ResumeItem) => {
    try {
      ResumeExporter.exportResume(resume, resume.template, 'pdf')
      message.success('简历下载成功')
    } catch (error) {
      message.error('简历下载失败，请重试')
    }
  }

  // 处理编辑简历
  const handleEdit = (resume: ResumeItem) => {
    // 将选中的简历信息存储到sessionStorage或状态管理中
    sessionStorage.setItem('editResumeId', resume.resumeId)
    // 导航到简历生成页面进行编辑
    navigate('/resume')
  }

  // 处理删除简历
  const handleDelete = (id: string) => {
    confirm({
      title: '确认删除',
      content: '确定要删除这份简历吗？此操作不可撤销。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        try {
          // 从localStorage删除简历
          const updatedResumes = resumes.filter(resume => resume.resumeId !== id)
          localStorage.setItem('resumes', JSON.stringify(updatedResumes))
          setResumes(updatedResumes)
          message.success('简历删除成功')
        } catch (error) {
          console.error('删除简历失败:', error)
          message.error('删除简历失败，请重试')
        }
      }
    })
  }

  // 处理预览简历
  const handlePreview = (resume: ResumeItem) => {
    setSelectedResume(resume)
    setPreviewVisible(true)
  }

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: ['personalInfo', 'name'],
      key: 'name',
    },
    {
      title: '职位',
      dataIndex: ['personalInfo', 'title'],
      key: 'title',
    },
    {
      title: '模板',
      dataIndex: 'template',
      key: 'template',
      render: (template: string) => {
        const templateMap = {
          standard: '标准模板',
          modern: '现代模板',
          creative: '创意模板'
        }
        return templateMap[template as keyof typeof templateMap] || template
      }
    },
    {
      title: '创建日期',
      dataIndex: 'displayDate',
      key: 'displayDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ResumeItem) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
            预览
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.resumeId)}>
            删除
          </Button>
          <Button type="text" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
            下载
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>个人简历库</Title>
        <Button 
          type="primary" 
          onClick={() => navigate('/resume')}
          style={{
            padding: '6px 16px',
            fontSize: '14px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          创建新简历
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" tip="加载中..." />
        </div>
      ) : resumes.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={resumes} 
          rowKey="id" 
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
        />
      ) : (
        <Card>
          <div style={{ textAlign: 'center', color: '#999', padding: '60px 0' }}>
            <Space direction="vertical" size="large">
              <div>
                <Title level={4}>简历库为空</Title>
                <p style={{ color: '#666' }}>
                  您还没有保存任何简历，点击上方按钮创建新简历
                </p>
              </div>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/resume')}
                style={{
                  padding: '10px 24px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(52, 152, 219, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                创建第一份简历
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* 简历预览模态框 */}
      <Modal
        title="简历预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => selectedResume && handleDownload(selectedResume)}
          >
            下载
          </Button>
        ]}
        width={800}
      >
        {selectedResume && (
          <div style={{ overflow: 'auto', maxHeight: 600 }}>
            <StandardResumeTemplate resume={selectedResume} />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ResumeLibrary