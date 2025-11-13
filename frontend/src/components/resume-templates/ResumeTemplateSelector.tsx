import React from 'react'
import { Radio, Card, Space, Modal, Form, Input, InputNumber, Select, Button, message, Typography } from 'antd'
import type { Resume } from '../../types/resume'
import StandardResumeTemplate from './StandardResumeTemplate'
import ExperienceEditor from './ExperienceEditor'
import EducationEditor from './EducationEditor'

interface ResumeTemplateSelectorProps {
  resume: Resume
  selectedTemplate: string
  onTemplateChange: (template: string) => void
  onPhotoChange?: (photo: string) => void
  editingSection?: string | null
  onUpdateSection?: (section: string, data: any) => void
  onSectionClick?: (section: string | null) => void
  isInlineEditMode?: boolean
  isEditing?: boolean
}

const { Text, Title } = Typography
const { Option } = Select
const { TextArea } = Input

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({
  resume,
  selectedTemplate,
  onTemplateChange,
  onPhotoChange,
  editingSection,
  onUpdateSection,
  onSectionClick,
  isInlineEditMode = true
}) => {
  // 编辑表单实例
  const [form] = Form.useForm()
  
  // 当编辑区域变化时，更新表单数据
  React.useEffect(() => {
    if (editingSection && resume) {
      const sectionData = resume[editingSection as keyof Resume]
      if (sectionData) {
        form.setFieldsValue(sectionData)
      }
    }
  }, [editingSection, resume, form])
  
  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingSection && onUpdateSection) {
        onUpdateSection(editingSection, values)
        // 保存成功后关闭编辑模态框
        if (onSectionClick) {
          onSectionClick(null)
        }
      }
    }).catch(() => {
      message.error('表单验证失败')
    })
  }
  
  // 渲染编辑表单
  const renderEditForm = () => {
    if (!editingSection || !resume) return null
    
    // 基础表单样式配置
    const formConfig = isInlineEditMode ? {
      layout: 'vertical' as const,
      style: {
        maxWidth: '800px',
        margin: '0 auto'
      }
    } : {
      layout: 'vertical' as const
    }
    
    switch (editingSection) {
      case 'personalInfo':
        return (
          <Form form={form} {...formConfig}>
            <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item label="职位" name="title">
              <Input placeholder="请输入职位" />
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input type="email" placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item label="电话" name="phone">
              <Input placeholder="请输入电话" />
            </Form.Item>
            <Form.Item label="地址" name="location">
              <Input placeholder="请输入地址" />
            </Form.Item>
            <Form.Item label="性别" name="gender">
              <Select placeholder="请选择性别">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </Form.Item>
            <Form.Item label="年龄" name="age">
              <InputNumber placeholder="请输入年龄" />
            </Form.Item>
            <Form.Item label="籍贯" name="hometown">
              <Input placeholder="请输入籍贯" />
            </Form.Item>
            <Form.Item label="身高" name="height">
              <Input placeholder="请输入身高" />
            </Form.Item>
            <Form.Item label="婚姻状况" name="marriageStatus">
              <Select placeholder="请选择婚姻状况">
                <Option value="未婚">未婚</Option>
                <Option value="已婚">已婚</Option>
              </Select>
            </Form.Item>
            <Form.Item label="政治面貌" name="politicalStatus">
              <Input placeholder="请输入政治面貌" />
            </Form.Item>
          </Form>
        )
      case 'summary':
        return (
          <Form form={form} {...formConfig}>
            <Form.Item label="自我简评" name="" initialValue={resume.summary}>
              <TextArea rows={6} placeholder="请输入自我简评内容" />
            </Form.Item>
          </Form>
        )
      case 'education':
        return (
          <div>
            <Title level={4}>教育背景</Title>
            <EducationEditor
              education={resume.education || []}
              onUpdateEducation={(updatedEducation) => {
                if (onUpdateSection) {
                  onUpdateSection('education', updatedEducation)
                }
              }}
            />
          </div>
        )
      case 'experiences':
        return (
          <div>
            <Title level={4}>工作背景</Title>
            <ExperienceEditor
              experiences={resume.experiences || []}
              onUpdateExperiences={(updatedExperiences) => {
                if (onUpdateSection) {
                  onUpdateSection('experiences', updatedExperiences)
                }
              }}
            />
          </div>
        )
      default:
        return (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">此模块的编辑功能正在开发中...</Text>
            <Form form={form} {...formConfig}>
              <Form.Item style={{
                marginTop: '20px',
                textAlign: 'center'
              }}>
                <Button type="primary" onClick={handleSubmit} size="large">
                  保存更改
                </Button>
              </Form.Item>
            </Form>
          </div>
        )
    }
  }
  
  return (
      <div className="resume-template-selector" style={{
        ...(isInlineEditMode && {
          maxWidth: '100%',
          width: '100%',
          margin: '0 auto'
        })
      }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* 模板选择器 */}
          <div style={{ marginBottom: '20px' }}>
            <Radio.Group value={selectedTemplate} onChange={(e) => onTemplateChange(e.target.value)}>
              <Radio.Button value="standard">标准模板</Radio.Button>
              <Radio.Button value="modern">现代模板</Radio.Button>
              <Radio.Button value="creative">创意模板</Radio.Button>
            </Radio.Group>
          </div>

          {/* 模板预览 */}
          <Card>
            {selectedTemplate === 'standard' && (
              <StandardResumeTemplate 
                resume={resume} 
                onPhotoChange={onPhotoChange} 
                onSectionClick={(section) => {
                  // 当点击编辑按钮时，设置编辑区域
                  if (editingSection !== section) {
                    // 如果当前没有正在编辑的内容，或者点击的是不同的区域，打开编辑
                    // 这里可以添加额外的逻辑，比如提示保存当前编辑内容等
                    if (onSectionClick) {
                      onSectionClick(section);
                    }
                  }
                }} 
                isEditing={true}
              />
            )}
            {/* 其他模板会在这里条件渲染 */}
          </Card>
        </Space>
        
        {/* 编辑模态框 */}
        <Modal
          title={`编辑${getSectionName(editingSection || '')}`}
          open={!!editingSection}
          onOk={handleSubmit}
          onCancel={() => {
            // 取消编辑，重置表单并通知父组件关闭编辑状态
            form.resetFields();
            if (onSectionClick) {
              onSectionClick(null);
            }
          }}
          width={800}
          footer={[
            <Button key="cancel" onClick={() => {
              // 取消编辑，重置表单并通知父组件关闭编辑状态
              form.resetFields();
              if (onSectionClick) {
                onSectionClick(null);
              }
            }}>取消</Button>,
            <Button key="save" type="primary" onClick={handleSubmit}>保存</Button>
          ]}
        >
          {renderEditForm()}
        </Modal>
      </div>
      )
}

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

export default ResumeTemplateSelector