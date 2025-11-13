import React, { useState, useRef } from 'react'
import { Form, Input, InputNumber, Select, DatePicker, Button, message } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import { PlusOutlined } from '@ant-design/icons'
import AddEditItemModal from './AddEditItemModal'
import ListItemComponent from './ListItemComponent'

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: number
  description?: string
}

interface EducationEditorProps {
  education: Education[]
  onUpdateEducation: (education: Education[]) => void
}

const { Option } = Select
const { TextArea } = Input

const EducationEditor: React.FC<EducationEditorProps> = ({
  education = [],
  onUpdateEducation
}) => {
  // 使用useRef保存表单实例，避免不必要的重新创建
  const formRef = useRef<FormInstance<Education>>()
  const [form] = Form.useForm<Education>()
  
  // 在表单创建后保存到ref中
  React.useEffect(() => {
    formRef.current = form
  }, [form])
  
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)

  // 打开添加模态框
  const handleAddClick = () => {
    setEditingEducation(null)
    setIsModalVisible(true)
  }

  // 打开编辑模态框
  const handleEditClick = (edu: Education) => {
    // 确保编辑的项存在
    if (!edu) return
    
    // 先重置模态框状态
    setIsModalVisible(false)
    
    // 延迟设置编辑项和显示模态框，确保状态完全重置
    setTimeout(() => {
      setEditingEducation({ ...edu }) // 深拷贝，避免直接修改原始数据
      setIsModalVisible(true)
    }, 100)
  }

  // 删除教育经历
  const handleDeleteClick = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id)
    onUpdateEducation(updatedEducation)
    message.success('删除成功')
  }

  // 处理保存
  const handleSave = (values: Education) => {
    let updatedEducation: Education[]
    if (editingEducation) {
      // 更新现有教育经历
      updatedEducation = education.map(edu =>
        edu.id === editingEducation.id ? { ...values } : edu
      )
    } else {
      // 添加新教育经历，确保有唯一ID
      const newEducation = { 
        ...values, 
        id: values.id || `edu-${Date.now()}` 
      }
      updatedEducation = [...education, newEducation]
    }
    
    onUpdateEducation(updatedEducation)
    message.success(editingEducation ? '更新成功' : '添加成功')
    
    // 关闭模态框并重置状态
    setIsModalVisible(false)
    setEditingEducation(null)
  }

  const degreeOptions = [
    { label: '小学', value: '小学' },
    { label: '初中', value: '初中' },
    { label: '高中', value: '高中' },
    { label: '专科', value: '专科' },
    { label: '学士', value: '学士' },
    { label: '硕士', value: '硕士' },
    { label: '博士', value: '博士' }
  ]

  return (
    <div>
      {/* 教育背景列表 */}
      {education.length > 0 ? (
        <div>
          {education.map((edu) => (
            <ListItemComponent
              key={edu.id}
              title={`${edu.degree} | ${edu.field} at ${edu.institution}`}
              subtitle={`${edu.startDate} - ${edu.endDate || '至今'}`}
              description={edu.description}
              tags={edu.gpa ? [`GPA: ${edu.gpa}`] : undefined}
              onEdit={() => handleEditClick(edu)}
              onDelete={() => handleDeleteClick(edu.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          暂无教育背景，请添加
        </div>
      )}

      {/* 添加按钮 */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddClick}
        style={{
          width: '100%',
          marginTop: '16px',
          padding: '10px 0',
          borderRadius: 8,
          background: '#f0f9ff',
          border: '1px dashed #91d5ff',
          color: '#1890ff'
        }}
      >
        添加教育经历
      </Button>

      {/* 添加/编辑教育经历模态框 */}
      <AddEditItemModal
        visible={isModalVisible}
        title={editingEducation ? '编辑教育经历' : '添加教育经历'}
        item={editingEducation || {
          id: `edu-${Date.now()}`,
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: undefined,
          description: ''
        }}
        form={form}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingEducation(null)
        }}
        onSave={handleSave}
      >
        <Form.Item
          label="学校名称"
          name="institution"
          rules={[{ required: true, message: '请输入学校名称' }]}
        >
          <Input placeholder="请输入学校名称" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Form.Item
            label="学位"
            name="degree"
            rules={[{ required: true, message: '请选择学位' }]}
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Select placeholder="请选择学位">
              {degreeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="专业"
            name="field"
            rules={[{ required: true, message: '请输入专业' }]}
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Input placeholder="请输入专业" />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Form.Item
            label="开始日期"
            name="startDate"
            rules={[{ required: true, message: '请选择开始日期' }]}
            style={{ flex: 1, marginBottom: 0 }}
          >
            <DatePicker
              placeholder="选择开始日期"
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              // 移除直接的onChange设置，让Form.Item自动处理值的绑定
            />
          </Form.Item>

          <Form.Item
            label="结束日期"
            name="endDate"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <DatePicker
              placeholder="选择结束日期"
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              // 移除直接的onChange设置，让Form.Item自动处理值的绑定
            />
          </Form.Item>
        </div>

        <Form.Item
          label="GPA"
          name="gpa"
          tooltip="可选，如 3.8/4.0 请输入 3.8"
        >
          <InputNumber
            placeholder="请输入GPA"
            min={0}
            max={5}
            step={0.1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="教育描述"
          name="description"
        >
          <TextArea rows={3} placeholder="请简要描述您的教育经历" />
        </Form.Item>
      </AddEditItemModal>
    </div>
  )
}

export default EducationEditor