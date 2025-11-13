import React, { useEffect } from 'react'
import { Modal, Form, Button, message } from 'antd'
import type { FormInstance } from 'antd/lib/form'

interface AddEditItemModalProps<T> {
  visible: boolean
  title: string
  item: T | null
  form: FormInstance<T>
  onCancel: () => void
  onSave: (values: T) => void
  children: React.ReactNode
  width?: number
}

export const AddEditItemModal = <T,>({
  visible,
  title,
  item,
  form,
  onCancel,
  onSave,
  children,
  width = 600
}: AddEditItemModalProps<T>) => {
  // 当模态框打开且item变化时，更新表单数据
  useEffect(() => {
    // 只有当模态框从不可见到可见时，或者item发生变化时，才设置表单值
    if (visible) {
      // 使用setTimeout确保DOM已经渲染完成
      setTimeout(() => {
        if (item) {
          form.setFieldsValue(item as any)
        } else {
          form.resetFields()
        }
      }, 0)
    }
  }, [visible, item, form])

  // 处理保存
  const handleSave = () => {
    form.validateFields()
      .then(values => {
        // 只调用onSave，具体的数据处理和状态管理由父组件完成
        onSave(values)
      })
      .catch(() => {
        message.error('表单验证失败')
      })
  }

  // 处理取消
  const handleCancel = () => {
    // 先调用onCancel，让父组件更新状态
    onCancel()
    // 然后在模态框关闭后重置表单，避免影响下次打开
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleSave}
      onCancel={handleCancel}
      width={width}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={handleCancel}>取消</Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          {item ? '更新' : '添加'}
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: '100%' }}
      >
        {children}
      </Form>
    </Modal>
  )
}

export default AddEditItemModal