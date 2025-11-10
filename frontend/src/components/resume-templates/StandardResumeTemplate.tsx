import React from 'react'
import { Typography } from 'antd'
import type { Resume } from '../../types/resume'
import PhotoUploader from '../PhotoUploader'

const { Title, Text, Paragraph } = Typography

interface StandardResumeTemplateProps {
  resume: Resume
  onPhotoChange?: (photo: string) => void
}

/**
 * 标准简历模板组件 - 严格按照用户指定模板顺序设计
 */
const StandardResumeTemplate: React.FC<StandardResumeTemplateProps> = ({ resume, onPhotoChange }) => {
  const { personalInfo, experiences, education, skills, summary, projects } = resume

  // 格式化日期显示
  const formatDate = (dateString: string, endDateString?: string) => {
    if (!endDateString || endDateString === 'present') {
      return `${new Date(dateString).getFullYear()} 至今`
    }
    return `${new Date(dateString).getFullYear()} - ${new Date(endDateString).getFullYear()}`
  }

  // 按类别分组技能
  const groupedSkills = skills.reduce((groups, skill) => {
    const group = groups[skill.category] || []
    group.push(skill)
    groups[skill.category] = group
    return groups
  }, {} as Record<string, typeof skills>)

  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5cm', fontFamily: 'Microsoft YaHei, Arial, sans-serif' }}>
      {/* 个人信息区域 - 按图片格式重新设计 */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* 左侧个人信息 */}
          <div style={{ flex: 1, marginRight: '20px' }}>
            {/* 姓名居中 */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <Title level={1} style={{ margin: 0, color: '#000', fontWeight: 'bold', fontSize: '28px' }}>
                {personalInfo.name}
              </Title>
            </div>
            
            {/* 详细个人信息行 - 移除前缀文字，只保留关键词 */}
            <div style={{ fontSize: '14px', color: '#333', marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
              {personalInfo.gender && <span>{personalInfo.gender}</span>}
              {personalInfo.age && <span>|</span>}
              {personalInfo.age && <span>{personalInfo.age}</span>}
              {personalInfo.hometown && <span>|</span>}
              {personalInfo.hometown && <span>{personalInfo.hometown}</span>}
              {personalInfo.height && <span>|</span>}
              {personalInfo.height && <span>{personalInfo.height}</span>}
              {personalInfo.marriageStatus && <span>|</span>}
              {personalInfo.marriageStatus && <span>{personalInfo.marriageStatus}</span>}
              {personalInfo.politicalStatus && <span>|</span>}
              {personalInfo.politicalStatus && <span>{personalInfo.politicalStatus}</span>}
            </div>
            
            {/* 联系方式 */}
            <div style={{ fontSize: '14px', color: '#333', textAlign: 'center' }}>
              {personalInfo.phone && <span style={{ marginRight: '15px' }}>{personalInfo.phone}</span>}
              {personalInfo.email && <span>{personalInfo.email}</span>}
            </div>
          </div>
          
          {/* 右侧照片区域 */}
          <div style={{}}>
            {onPhotoChange && (
              <PhotoUploader 
                photo={personalInfo.photo || ''} 
                onChange={onPhotoChange} 
              />
            )}
          </div>
        </div>

      {/* 1. 教育背景 - 第一位 */}
      <div style={{ marginBottom: '30px' }}>
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '15px', borderLeft: '4px solid #3498db', paddingLeft: '10px' }}>
          教育背景
        </Title>
        <div style={{ height: '2px', backgroundColor: '#000', marginBottom: '15px' }}></div>
        {education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' }}>{edu.institution}</Text>
              <Text style={{ color: '#7f8c8d', fontSize: '14px' }}>
                {formatDate(edu.startDate, edu.endDate)}
              </Text>
            </div>
            <Text style={{ fontSize: '15px', color: '#3498db', marginBottom: '5px', display: 'block' }}>
              {edu.degree} | {edu.field}
            </Text>
            {edu.gpa && (
              <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>GPA: {edu.gpa}</Text>
            )}
            {edu.description && (
              <Paragraph style={{ marginTop: '5px', fontSize: '14px', color: '#34495e' }}>
                {edu.description}
              </Paragraph>
            )}
          </div>
        ))}
      </div>

      {/* 2. 自我简评 - 第二位 */}
      {summary && (
        <div style={{ marginBottom: '30px' }}>
          <Title level={4} style={{ color: '#2c3e50', marginBottom: '15px', borderLeft: '4px solid #3498db', paddingLeft: '10px' }}>
            自我简评
          </Title>
          <div style={{ height: '2px', backgroundColor: '#000', marginBottom: '15px' }}></div>
          <Paragraph style={{ color: '#34495e', lineHeight: '1.6', fontSize: '14px' }}>
            {summary}
          </Paragraph>
        </div>
      )}

      {/* 3. 工作背景 - 第三位 */}
      <div style={{ marginBottom: '30px' }}>
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '15px', borderLeft: '4px solid #3498db', paddingLeft: '10px' }}>
          工作背景
        </Title>
        <div style={{ height: '2px', backgroundColor: '#000', marginBottom: '15px' }}></div>
        {experiences.map((exp) => (
          <div key={exp.id} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' }}>{exp.company}</Text>
              <Text style={{ color: '#7f8c8d', fontSize: '14px' }}>
                {formatDate(exp.startDate, exp.endDate)}
              </Text>
            </div>
            <Text style={{ fontSize: '15px', color: '#3498db', marginBottom: '10px', display: 'block' }}>
              {exp.position}
            </Text>
            <Paragraph style={{ marginBottom: '10px', color: '#34495e', lineHeight: '1.6', fontSize: '14px' }}>
              {exp.description}
            </Paragraph>
            {exp.achievements && exp.achievements.length > 0 && (
              <div>
                <Paragraph style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                  主要成就:
                </Paragraph>
                <ul style={{ marginBottom: '0', paddingLeft: '20px' }}>
                  {exp.achievements.map((achievement, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#3498db', fontSize: '14px' }}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {exp.technologies && exp.technologies.length > 0 && (
              <Paragraph style={{ marginTop: '5px', fontSize: '14px', color: '#7f8c8d' }}>
                技术栈: {exp.technologies.join(', ')}
              </Paragraph>
            )}
          </div>
        ))}
      </div>

      {/* 4. 项目经验 - 第四位 */}
      {projects && projects.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <Title level={4} style={{ color: '#2c3e50', marginBottom: '15px', borderLeft: '4px solid #3498db', paddingLeft: '10px' }}>
            项目经验
          </Title>
          <div style={{ height: '2px', backgroundColor: '#000', marginBottom: '15px' }}></div>
          {projects.map((project, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <Text style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' }}>
                  {project.title || `项目 ${index + 1}`}
                </Text>
                {project.date && (
                  <Text style={{ color: '#7f8c8d', fontSize: '14px' }}>
                    {project.date}
                  </Text>
                )}
              </div>
              <Text style={{ fontSize: '15px', color: '#3498db', marginBottom: '5px', display: 'block' }}>
                角色: {project.role}
              </Text>
              <Paragraph style={{ marginBottom: '10px', color: '#34495e', lineHeight: '1.6', fontSize: '14px' }}>
                {project.contribution}
              </Paragraph>
              {project.highlights && project.highlights.length > 0 && (
                <ul style={{ marginBottom: '0', paddingLeft: '20px' }}>
                  {project.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} style={{ marginBottom: '3px', color: '#34495e', fontSize: '14px' }}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 5. 活动经历 - 第五位 (添加的新部分) */}
      <div style={{ marginBottom: '30px' }}>
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '15px', borderLeft: '4px solid #3498db', paddingLeft: '10px' }}>
          活动经历
        </Title>
        <div style={{ height: '2px', backgroundColor: '#000', marginBottom: '15px' }}></div>
        {/* 目前没有活动经历数据，显示占位信息 */}
        <Paragraph style={{ fontSize: '14px', color: '#7f8c8d', fontStyle: 'italic' }}>
          暂无活动经历信息
        </Paragraph>
      </div>

      {/* 6. 其他资质 - 第六位 (添加的新部分) */}
      <div style={{ marginBottom: '30px' }}>
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '15px', borderLeft: '4px solid #3498db', paddingLeft: '10px' }}>
          其他资质
        </Title>
        <div style={{ height: '2px', backgroundColor: '#000', marginBottom: '15px' }}></div>
        {/* 将技能部分移至其他资质中 */}
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} style={{ marginBottom: '15px' }}>
            <Paragraph style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#2c3e50' }}>
              {category}:
            </Paragraph>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categorySkills.map((skill) => (
                <span key={skill.id} style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontSize: '14px',
                  color: '#000'
                }}>
                  • {skill.name} {skill.years && `(经验: ${skill.years}年)`}
                </span>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(groupedSkills).length === 0 && skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map((skill) => (
              <span key={skill.id} style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontSize: '14px', 
                color: '#000'
              }}>
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StandardResumeTemplate