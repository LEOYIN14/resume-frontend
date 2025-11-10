import React from 'react'
import { Radio, Card, Space } from 'antd'
import type { Resume } from '../../types/resume'
import StandardResumeTemplate from './StandardResumeTemplate'

interface ResumeTemplateSelectorProps {
  resume: Resume
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({
  resume,
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div>
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
          {selectedTemplate === 'standard' && <StandardResumeTemplate resume={resume} />}
          {/* 其他模板会在这里条件渲染 */}
        </Card>
      </Space>
    </div>
  )
}

export default ResumeTemplateSelector