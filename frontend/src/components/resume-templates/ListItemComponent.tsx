import React from 'react'
import { Card, Button, Space, Typography, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Text, Paragraph } = Typography

interface ListItemComponentProps {
  title: string
  subtitle?: string
  description?: string
  tags?: string[]
  onEdit: () => void
  onDelete: () => void
  className?: string
}

const ListItemComponent: React.FC<ListItemComponentProps> = ({
  title,
  subtitle,
  description,
  tags,
  onEdit,
  onDelete,
  className = ''
}) => {
  return (
    <Card
      className={`resume-list-item ${className}`}
      style={{
        marginBottom: 16,
        transition: 'all 0.3s ease',
        borderRadius: 8,
        borderLeft: '4px solid #1890ff'
      }}
      extra={
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={onEdit}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              onClick={onDelete}
              danger
              style={{ color: '#ff4d4f' }}
            />
          </Tooltip>
        </Space>
      }
      hoverable
    >
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ fontSize: 16, marginRight: 12 }}>{title}</Text>
        {subtitle && (
          <Text type="secondary" style={{ fontSize: 14 }}>{subtitle}</Text>
        )}
      </div>
      
      {description && (
        <Paragraph
          style={{ marginBottom: 8, color: '#333', lineHeight: 1.6 }}
          ellipsis={{
            rows: 2,
            expandable: true,
            symbol: '...查看更多'
          }}
        >
          {description}
        </Paragraph>
      )}
      
      {tags && tags.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <Space size="small">
            {tags.map((tag, index) => (
              <Text
                key={index}
                mark
                style={{
                  backgroundColor: '#e6f7ff',
                  color: '#1890ff',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 12
                }}
              >
                {tag}
              </Text>
            ))}
          </Space>
        </div>
      )}
    </Card>
  )
}

export default ListItemComponent