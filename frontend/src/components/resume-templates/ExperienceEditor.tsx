import React, { useState } from 'react'
import { Form, Input, Select, DatePicker, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import AddEditItemModal from './AddEditItemModal'
import ListItemComponent from './ListItemComponent'
import type { Dayjs } from 'dayjs'

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  achievements?: string[]
  technologies?: string[]
}

interface ExperienceEditorProps {
  experiences: Experience[]
  onUpdateExperiences: (experiences: Experience[]) => void
}
const { TextArea } = Input

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experiences = [],
  onUpdateExperiences
}) => {
  const [form] = Form.useForm<Experience>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [achievementInputs, setAchievementInputs] = useState<string[]>([])

  // 打开添加模态框
  const handleAddClick = () => {
    setEditingExperience(null)
    setAchievementInputs([])
    setIsModalVisible(true)
  }

  // 打开编辑模态框
  const handleEditClick = (experience: Experience) => {
    setEditingExperience(experience)
    setAchievementInputs(experience.achievements || [])
    setIsModalVisible(true)
  }

  // 删除工作经历
  const handleDeleteClick = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id)
    onUpdateExperiences(updatedExperiences)
    message.success('删除成功')
  }

  // 处理保存
  const handleSave = (values: Experience) => {
    // 合并成就列表
    const updatedValues = {
      ...values,
      achievements: achievementInputs.filter(item => item.trim())
    }

    let updatedExperiences: Experience[]
    if (editingExperience) {
      // 更新现有经历
      updatedExperiences = experiences.map(exp =>
        exp.id === editingExperience.id ? updatedValues : exp
      )
    } else {
      // 添加新经历
      updatedExperiences = [...experiences, updatedValues]
    }
    
    onUpdateExperiences(updatedExperiences)
    message.success(editingExperience ? '更新成功' : '添加成功')
    setIsModalVisible(false)
    setEditingExperience(null)
    setAchievementInputs([])
  }

  // 添加成就输入框
  const addAchievementInput = () => {
    setAchievementInputs([...achievementInputs, ''])
  }

  // 更新成就内容
  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievementInputs]
    newAchievements[index] = value
    setAchievementInputs(newAchievements)
  }

  // 移除成就输入框
  const removeAchievementInput = (index: number) => {
    const newAchievements = achievementInputs.filter((_, i) => i !== index)
    setAchievementInputs(newAchievements)
  }

  return (
    <div>
      {/* 工作经历列表 */}
      {experiences.length > 0 ? (
        <div>
          {experiences.map((experience) => (
            <ListItemComponent
              key={experience.id}
              title={`${experience.position} at ${experience.company}`}
              subtitle={`${experience.startDate} - ${experience.endDate || '至今'}`}
              description={experience.description}
              tags={experience.technologies}
              onEdit={() => handleEditClick(experience)}
              onDelete={() => handleDeleteClick(experience.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          暂无工作经历，请添加
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
        添加工作经历
      </Button>

      {/* 添加/编辑工作经历模态框 */}
      <AddEditItemModal
        visible={isModalVisible}
        title={editingExperience ? '编辑工作经历' : '添加工作经历'}
        item={editingExperience || {
          id: `exp-${Date.now()}`,
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          achievements: [],
          technologies: []
        }}
        form={form}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingExperience(null)
          setAchievementInputs([])
        }}
        onSave={handleSave}
      >
        <Form.Item
          label="公司名称"
          name="company"
          rules={[{ required: true, message: '请输入公司名称' }]}
        >
          <Input placeholder="请输入公司名称" />
        </Form.Item>

        <Form.Item
          label="职位"
          name="position"
          rules={[{ required: true, message: '请输入职位' }]}
        >
          <Input placeholder="请输入职位" />
        </Form.Item>

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
              onChange={(date: Dayjs | null) => {
                if (date) form.setFieldsValue({ startDate: date.format('YYYY-MM-DD') })
              }}
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
              onChange={(date: Dayjs | null) => {
                if (date) form.setFieldsValue({ endDate: date.format('YYYY-MM-DD') })
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="工作描述"
          name="description"
        >
          <TextArea rows={4} placeholder="请简要描述您的工作职责和内容" />
        </Form.Item>

        <Form.Item
          label="主要成就"
        >
          <div>
            {achievementInputs.map((value, index) => (
              <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Input
                  placeholder={`成就 ${index + 1}`}
                  value={value}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                <Button
                  danger
                  size="small"
                  onClick={() => removeAchievementInput(index)}
                >
                  删除
                </Button>
              </div>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addAchievementInput}
              style={{ width: '100%' }}
            >
              添加成就
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          label="使用的技术"
          name="technologies"
        >
          <Select
            mode="tags"
            placeholder="输入技术名称并按回车添加"
            style={{ width: '100%' }}
            tokenSeparators={[',', ' ']}
          />
        </Form.Item>
      </AddEditItemModal>
    </div>
  )
}

export default ExperienceEditor