import React, { useState, useEffect } from 'react'
import { Typography, Button, Space, Card, message, Modal, Input, Dropdown } from 'antd'
import { FileSyncOutlined, DownloadOutlined, DownOutlined, SaveOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ResumeTemplateSelector from '../components/resume-templates/ResumeTemplateSelector'
import ResumeExporter from '../utils/resumeExporter'
import type { Resume, ResumeTemplate } from '../types/resume'
// import type { RootState } from '../types/store'

const { Title } = Typography

// 基础简历数据结构
const baseResumeData: Partial<Resume> = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    photo: '',
    gender: '',
    age: '',
    hometown: '',
    height: '',
    marriageStatus: '',
    politicalStatus: ''
  },
  experiences: [],
  education: [],
  skills: [],
  summary: '',
  template: 'standard' as ResumeTemplate,
  projects: []
}

// 转换项目数据到简历引用格式
const convertProjectsToResumeFormat = (projects: any[]): any[] => {
  return projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    role: project.role || '开发者',
    startDate: project.startDate || '',
    endDate: project.endDate || '进行中',
    technologies: project.technologies || [],
    achievements: project.achievements || []
  }))
}

// 获取模块名称的辅助函数
const getSectionName = (section: string): string => {
  const sectionNames: Record<string, string> = {
    'personalInfo': '个人信息',
    'education': '教育背景',
    'summary': '自我简评',
    'experiences': '工作背景',
    'activities': '活动经历',
    'skills': '技能/资质'
  }
  return sectionNames[section] || section
}

const Resume: React.FC = () => {
  const navigate = useNavigate()
  const { projects } = useSelector((state: any) => state.projects)

  // 初始化状态
  const [resume, setResume] = useState<Resume | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<'standard' | 'modern' | 'creative'>('standard')
  const [loading, setLoading] = useState(false)
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [resumeName, setResumeName] = useState('')
  const [saving, setSaving] = useState(false)
  const [templateModalVisible, setTemplateModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentResumeId, setCurrentResumeId] = useState<string>('')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [, setTempResumeData] = useState<Resume | null>(null)
  
  // 从简历库加载编辑数据
  useEffect(() => {
    const resumeId = sessionStorage.getItem('editResumeId') || sessionStorage.getItem('resumeId')
    if (resumeId) {
      try {
        // 从localStorage读取所有简历
        const storedResumes = localStorage.getItem('resumes')
        if (storedResumes) {
          const resumes = JSON.parse(storedResumes)
          const resumeToEdit = resumes.find((resume: any) => resume.resumeId === resumeId || resume.id === resumeId)
          
          if (resumeToEdit) {
            // 加载简历数据
            setResume({
              id: resumeToEdit.id || resumeId,
              personalInfo: resumeToEdit.personalInfo || baseResumeData.personalInfo!,
              education: resumeToEdit.education || [],
              experiences: resumeToEdit.experiences || [],
              projects: resumeToEdit.projects || [],
              skills: resumeToEdit.skills || [],
              summary: resumeToEdit.summary || '',
              template: resumeToEdit.template || 'standard',
              createdAt: resumeToEdit.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            setSelectedTemplate((resumeToEdit.template || 'standard') as 'standard' | 'modern' | 'creative')
            setIsEditMode(true)
            setCurrentResumeId(resumeId)
            message.info('已加载简历数据，进入编辑模式')
          }
        }
        // 清除sessionStorage中的resumeId，避免下次打开时自动进入编辑
        sessionStorage.removeItem('editResumeId')
        sessionStorage.removeItem('resumeId')
      } catch (error) {
        console.error('加载简历编辑数据失败:', error)
        message.error('加载简历数据失败，请重试')
      }
    }
  }, [])

  // 检查是否有编辑的简历ID
  useEffect(() => {
    const editResumeId = sessionStorage.getItem('editResumeId')
    if (editResumeId) {
      // 模拟从API获取简历数据
      setLoading(true)
      // 这里应该是实际的API调用，现在使用模拟数据
      const mockResumeData: Resume = {
        id: editResumeId,
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
        updatedAt: new Date().toISOString()
      }
      
      setTimeout(() => {
        setResume(mockResumeData)
        setSelectedTemplate(mockResumeData.template as 'standard' | 'modern' | 'creative')
        setLoading(false)
        // 清除编辑ID，避免重复编辑
        sessionStorage.removeItem('editResumeId')
      }, 500)
    }
  }, [])

  // 从projects中转换数据到简历格式
  useEffect(() => {
    if (projects && projects.length > 0) {
      // 这里可以根据实际需求，从projects中提取数据填充到简历中
      // 目前只是一个简单的示例
      const resumeProjects = convertProjectsToResumeFormat(projects)
      // 如果已有简历，只更新项目信息
      if (resume) {
        setResume({ ...resume, projects: resumeProjects })
      }
    }
  }, [projects, resume])

  // 打开模板选择模态框
  const handleGenerateResume = () => {
    setTemplateModalVisible(true)
  }

  // 实际生成简历
  const handleConfirmGenerateResume = () => {
    setTemplateModalVisible(false)
    setLoading(true)
    
    // 模拟API调用，生成简历
    setTimeout(() => {
      // 构建简历数据
      const generatedResume: Resume = {
        id: `resume-${Date.now()}`,
        personalInfo: {
          ...baseResumeData.personalInfo!,
          name: '张三',
          title: '高级前端开发工程师',
          email: 'zhangsan@example.com',
          phone: '138****1234',
          location: '北京'
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
        template: selectedTemplate as ResumeTemplate,
        projects: convertProjectsToResumeFormat(projects),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setResume(generatedResume)
      setLoading(false)
      message.success('简历生成成功')
    }, 2000)
  }

  // 照片处理功能已内联到onPhotoChange中

  // 打开保存模态框
  const handleOpenSaveModal = () => {
    // 设置默认名称
    if (resume?.personalInfo.name) {
      setResumeName(`${resume.personalInfo.name}_${resume.personalInfo.title || '简历'}`)
    } else {
      setResumeName(`个人简历_${new Date().toLocaleDateString('zh-CN')}`)
    }
    setSaveModalVisible(true)
  }

  // 保存到简历库
  const handleSaveToLibrary = () => {
    // 生成默认文件名
    const defaultFileName = resume?.personalInfo.name 
      ? `${resume.personalInfo.name}_${resume.personalInfo.title || '简历'}`
      : `个人简历_${new Date().toLocaleDateString('zh-CN')}`
    
    // 弹出对话框让用户输入文件名
    Modal.confirm({
      title: isEditMode ? '更新简历' : '保存简历',
      content: (
        <div>
          <p style={{ marginBottom: '16px' }}>请输入简历文件名：</p>
          <Input 
            id="resumeFileName" 
            defaultValue={defaultFileName} 
            placeholder="请输入简历文件名"
            style={{ width: '100%' }}
            autoFocus
          />
        </div>
      ),
      okText: '确定保存',
      cancelText: '取消',
      onOk: () => {
        // 获取用户输入的文件名
        const fileNameInput = document.getElementById('resumeFileName') as HTMLInputElement
        const resumeFileName = fileNameInput?.value?.trim() || defaultFileName
        
        if (!resumeFileName.trim()) {
          message.error('请输入简历名称')
          return
        }

        setSaving(true)
        setSaveModalVisible(false)
        
        // 使用localStorage保存简历数据
        setTimeout(() => {
          try {
            // 获取现有简历列表
            const existingResumes = JSON.parse(localStorage.getItem('resumes') || '[]')
            
            // 准备要保存的简历数据，确保包含必要的字段
            const now = new Date()
            const resumeToSave = {
              ...resume,
              name: resumeFileName,
              fileName: resumeFileName, // 新增fileName字段用于文件下载等场景
              resumeId: currentResumeId || resume?.id || `resume-${Date.now()}`,
              id: currentResumeId || resume?.id || `resume-${Date.now()}`,
              displayDate: new Date().toLocaleDateString('zh-CN'),
              createdAt: isEditMode && existingResumes.find((r: any) => r.resumeId === currentResumeId)?.createdAt || resume?.createdAt || now.toISOString(),
              updatedAt: now.toISOString()
            }
            
            // 检查是否已存在相同ID的简历（编辑模式）
            const existingIndex = existingResumes.findIndex((r: any) => r.resumeId === resumeToSave.resumeId || r.id === resumeToSave.id)
            
            if (existingIndex >= 0) {
              // 更新现有简历
              existingResumes[existingIndex] = resumeToSave
            } else {
              // 添加新简历
              existingResumes.push(resumeToSave)
            }
            
            // 保存到localStorage
            localStorage.setItem('resumes', JSON.stringify(existingResumes))
            
            message.success(isEditMode ? '简历更新成功' : '简历保存成功')
            setSaving(false)
            
            // 如果是编辑模式，提示用户是否继续编辑
            if (isEditMode) {
              Modal.confirm({
                title: '更新成功',
                content: '简历已更新，是否继续编辑？',
                okText: '继续编辑',
                cancelText: '查看简历库',
                onOk: () => {
                  // 保持在当前页面继续编辑
                },
                onCancel: () => {
                  // 跳转到简历库
                  navigate('/resume/library')
                }
              })
            } else {
              // 跳转到简历库页面
              navigate('/resume/library')
            }
          } catch (error) {
            console.error('保存简历失败:', error)
            message.error('简历保存失败，请重试')
            setSaving(false)
          }
        }, 500)
      }
    })
  }

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
            <>
              <Button 
                type="default" 
                icon={<SaveOutlined />}
                onClick={handleOpenSaveModal}
                style={{
                  padding: '6px 16px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  borderColor: '#d9d9d9',
                  transition: 'all 0.3s ease'
                }}
              >
                {isEditMode ? '更新简历' : '保存到简历库'}
              </Button>
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
              <Button 
                type="default" 
                icon={<DatabaseOutlined />}
                onClick={() => navigate('/resume/library')}
                style={{
                  padding: '6px 16px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  borderColor: '#d9d9d9',
                  transition: 'all 0.3s ease'
                }}
              >
                查看简历库
              </Button>
            </>
          )}
        </Space>
      </div>

      {resume ? (
        <>
          {/* 功能按钮区域 - 简化版 */}
          <div style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center'
          }}>
            {/* 取消编辑按钮 - 仅当有编辑项时显示 */}
            {editingSection && (
              <Button 
                danger 
                onClick={() => {
                  // 取消编辑时重置临时数据
                  setEditingSection(null)
                  setTempResumeData(null)
                }}
                style={{ marginLeft: 'auto' }}
              >
                取消编辑
              </Button>
            )}
          </div>
          
          <div style={{ 
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {editingSection && (
              <Typography.Title level={4} style={{ marginBottom: '20px' }}>
                正在编辑: {getSectionName(editingSection)}
              </Typography.Title>
            )}
            <ResumeTemplateSelector
              resume={resume}
              selectedTemplate={selectedTemplate}
              onTemplateChange={(template: string) => setSelectedTemplate(template as 'standard' | 'modern' | 'creative')}
              onPhotoChange={(photo: string) => {
                if (resume) {
                  setResume({
                    ...resume,
                    personalInfo: {
                      ...resume.personalInfo,
                      photo: photo
                    }
                  })
                }
              }}
              editingSection={editingSection}
              onSectionClick={setEditingSection}
              isEditing={!!editingSection} // 当已有编辑项时，标记为正在编辑
              onUpdateSection={(section, data) => {
                if (resume) {
                  // 正确处理数组类型的section（如education和experiences）
                  let updatedResume: Resume;
                  
                  // 判断是否为数组类型的section
                  if (section === 'education' || section === 'experiences' || section === 'skills' || section === 'projects') {
                    // 对于数组类型，确保返回的是数组
                    updatedResume = {
                      ...resume,
                      [section]: Array.isArray(data) ? data : [data],
                      updatedAt: new Date().toISOString()
                    };
                  } else {
                    // 对于非数组类型，直接更新
                    updatedResume = {
                      ...resume,
                      [section]: data,
                      updatedAt: new Date().toISOString()
                    };
                  }
                  
                  setResume(updatedResume)
                  // 保存到本地存储
                  localStorage.setItem('currentResume', JSON.stringify(updatedResume))
                  message.success(`${getSectionName(section)}更新成功`)
                }
              }}
            />
          </div>
        </>
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

      {/* 保存到简历库模态框 */}
      <Modal
        title="保存到简历库"
        open={saveModalVisible}
        onOk={handleSaveToLibrary}
        onCancel={() => setSaveModalVisible(false)}
        confirmLoading={saving}
        footer={[
          <Button key="cancel" onClick={() => setSaveModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveToLibrary} loading={saving}>
            保存
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8, color: '#666' }}>简历名称</p>
          <Input 
            value={resumeName} 
            onChange={(e) => setResumeName(e.target.value)} 
            placeholder="请输入简历名称"
            maxLength={50}
          />
        </div>
        <div style={{ color: '#999', fontSize: 14 }}>
          <p>保存后，您可以在简历库中查看、编辑和下载这份简历。</p>
        </div>
      </Modal>

      {/* 模板选择模态框 */}
      <Modal
        title="选择简历模板"
        open={templateModalVisible}
        footer={[
          <Button key="cancel" onClick={() => setTemplateModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={handleConfirmGenerateResume}
            loading={loading}
          >
            开始生成
          </Button>
        ]}
        width={800}
      >
        <div style={{ padding: '20px 0' }}>
          <Title level={4} style={{ marginBottom: 20 }}>请选择您喜欢的简历模板</Title>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: 20 }}>
          <div 
            className={`template-item ${selectedTemplate === 'standard' ? 'selected' : ''}`}
            style={{
              border: selectedTemplate === 'standard' ? '2px solid #1890ff' : '2px solid transparent',
              borderRadius: 8,
              padding: 10,
              cursor: 'pointer',
              transition: 'all 0.3s',
              width: '30%',
              position: 'relative'
            }}
            onClick={() => setSelectedTemplate('standard')}
          >
            <div style={{ height: 200, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 'bold' }}>标准模板</p>
                <p style={{ color: '#666', fontSize: 14, marginTop: 5 }}>简洁专业，适合大多数场合</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: selectedTemplate === 'standard' ? '#1890ff' : '#333' }}>标准模板</p>
            {selectedTemplate === 'standard' && (
              <div style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px', 
                backgroundColor: '#1890ff', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: 12 
              }}>✓ 已选择</div>
            )}
          </div>
          
          <div 
            className={`template-item ${selectedTemplate === 'modern' ? 'selected' : ''}`}
            style={{
              border: selectedTemplate === 'modern' ? '2px solid #1890ff' : '2px solid transparent',
              borderRadius: 8,
              padding: 10,
              cursor: 'pointer',
              transition: 'all 0.3s',
              width: '30%',
              position: 'relative'
            }}
            onClick={() => setSelectedTemplate('modern')}
          >
            <div style={{ height: 200, backgroundColor: '#f0f8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 'bold' }}>现代模板</p>
                <p style={{ color: '#666', fontSize: 14, marginTop: 5 }}>时尚简约，突出重点信息</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: selectedTemplate === 'modern' ? '#1890ff' : '#333' }}>现代模板</p>
            {selectedTemplate === 'modern' && (
              <div style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px', 
                backgroundColor: '#1890ff', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: 12 
              }}>✓ 已选择</div>
            )}
          </div>
          
          <div 
            className={`template-item ${selectedTemplate === 'creative' ? 'selected' : ''}`}
            style={{
              border: selectedTemplate === 'creative' ? '2px solid #1890ff' : '2px solid transparent',
              borderRadius: 8,
              padding: 10,
              cursor: 'pointer',
              transition: 'all 0.3s',
              width: '30%',
              position: 'relative'
            }}
            onClick={() => setSelectedTemplate('creative')}
          >
            <div style={{ height: 200, backgroundColor: '#fff8dc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 'bold' }}>创意模板</p>
                <p style={{ color: '#666', fontSize: 14, marginTop: 5 }}>独特设计，展现个性特点</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: selectedTemplate === 'creative' ? '#1890ff' : '#333' }}>创意模板</p>
            {selectedTemplate === 'creative' && (
              <div style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px', 
                backgroundColor: '#1890ff', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: 12 
              }}>✓ 已选择</div>
            )}
          </div>
        </div>
        
        <style>{`
          .template-item:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          
          .template-item.selected {
            box-shadow: 0 4px 16px rgba(24, 144, 255, 0.2);
          }
        `}</style>
        </div>
      </Modal>
    </div>
  )
}

export default Resume