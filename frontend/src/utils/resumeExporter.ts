import { message } from 'antd'
import type { Resume } from '../types/resume'

/**
 * 简历导出工具类
 * 提供不同格式的简历导出功能
 */
class ResumeExporter {
  /**
   * 导出简历为PDF格式
   * @param resume 简历数据
   * @param template 模板类型
   */
  static async exportToPDF(resume: Resume): Promise<void> {
    try {
      // 在实际应用中，这里应该使用如html2pdf.js、jsPDF等库将简历转换为PDF
      // 目前模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟文件下载
      const blob = new Blob(['简历PDF内容'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resume.personalInfo.name}_简历.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      message.success('简历PDF导出成功')
    } catch (error) {
      console.error('PDF导出失败:', error)
      message.error('简历导出失败，请重试')
    }
  }

  /**
   * 导出简历为HTML格式
   * @param resume 简历数据
   * @param template 模板类型
   */
  static async exportToHTML(resume: Resume): Promise<void> {
    try {
      // 构建基本HTML内容
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resume.personalInfo.name}的简历</title>
          <style>
            body {
              font-family: 'Microsoft YaHei', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3 {
              color: #2c3e50;
            }
            .section {
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            .contact-info {
              background-color: #f5f5f5;
              padding: 10px;
              border-radius: 4px;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>${resume.personalInfo.name}</h1>
            <h2>${resume.personalInfo.title}</h2>
            <div class="contact-info">
              <p>邮箱: ${resume.personalInfo.email}</p>
              <p>电话: ${resume.personalInfo.phone}</p>
              <p>地址: ${resume.personalInfo.location}</p>
            </div>
            <p>${resume.personalInfo.bio}</p>
          </header>
          
          ${resume.summary ? `
          <section class="section">
            <h2>个人简介</h2>
            <p>${resume.summary}</p>
          </section>
          ` : ''}
          
          ${resume.experiences && resume.experiences.length > 0 ? `
          <section class="section">
            <h2>工作经历</h2>
            ${resume.experiences.map(exp => `
              <div>
                <h3>${exp.position} - ${exp.company}</h3>
                <p>${exp.startDate} 至 ${exp.endDate}</p>
                <p>${exp.description}</p>
                ${exp.achievements && exp.achievements.length > 0 ? `
                <ul>
                  ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
                ` : ''}
                ${exp.technologies && exp.technologies.length > 0 ? `
                <p>技能: ${exp.technologies.join(', ')}</p>
                ` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}
          
          ${resume.education && resume.education.length > 0 ? `
          <section class="section">
            <h2>教育背景</h2>
            ${resume.education.map(edu => `
              <div>
                <h3>${edu.institution}</h3>
                <p>${edu.degree} - ${edu.field}</p>
                <p>${edu.startDate} 至 ${edu.endDate}</p>
                ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                ${edu.description ? `<p>${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}
          
          ${resume.skills && resume.skills.length > 0 ? `
          <section class="section">
            <h2>技能</h2>
            <div>
              ${resume.skills.map(skill => `
                <span style="display: inline-block; background: #eee; padding: 2px 8px; margin: 2px; border-radius: 4px;">
                  ${skill.name} (${skill.category})
                </span>
              `).join('')}
            </div>
          </section>
          ` : ''}
          
          ${resume.projects && resume.projects.length > 0 ? `
          <section class="section">
            <h2>项目经验</h2>
            ${resume.projects.map(proj => `
              <div>
                <h3>${proj.role}</h3>
                <p>${proj.contribution}</p>
                ${proj.highlights && proj.highlights.length > 0 ? `
                <ul>
                  ${proj.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}
        </body>
        </html>
      `
      
      // 导出HTML文件
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resume.personalInfo.name}_简历.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      message.success('简历HTML导出成功')
    } catch (error) {
      console.error('HTML导出失败:', error)
      message.error('简历导出失败，请重试')
    }
  }

  /**
   * 导出简历为文本格式
   * @param resume 简历数据
   */
  static async exportToText(resume: Resume): Promise<void> {
    try {
      // 构建文本内容
      let textContent = `${resume.personalInfo.name}\n${resume.personalInfo.title}\n\n`
      textContent += `联系方式:\n`
      textContent += `邮箱: ${resume.personalInfo.email}\n`
      textContent += `电话: ${resume.personalInfo.phone}\n`
      textContent += `地址: ${resume.personalInfo.location}\n\n`
      textContent += `${resume.personalInfo.bio}\n\n`
      
      if (resume.summary) {
        textContent += `个人简介:\n${resume.summary}\n\n`
      }
      
      if (resume.experiences && resume.experiences.length > 0) {
        textContent += `工作经历:\n`
        resume.experiences.forEach(exp => {
          textContent += `${exp.position} - ${exp.company}\n`
          textContent += `${exp.startDate} 至 ${exp.endDate}\n`
          textContent += `${exp.description}\n`
          if (exp.achievements && exp.achievements.length > 0) {
            textContent += `成就:\n`
            exp.achievements.forEach(ach => {
              textContent += `- ${ach}\n`
            })
          }
          if (exp.technologies && exp.technologies.length > 0) {
            textContent += `技能: ${exp.technologies.join(', ')}\n`
          }
          textContent += `\n`
        })
      }
      
      // 导出文本文件
      const blob = new Blob([textContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resume.personalInfo.name}_简历.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      message.success('简历文本导出成功')
    } catch (error) {
      console.error('文本导出失败:', error)
      message.error('简历导出失败，请重试')
    }
  }

  /**
   * 根据选择的格式导出简历
   * @param resume 简历数据
   * @param template 模板类型
   * @param format 导出格式 (pdf, html, text)
   */
  static async exportResume(resume: Resume, _template: string, format: 'pdf' | 'html' | 'text' = 'pdf'): Promise<void> {
    switch (format) {
      case 'pdf':
        await this.exportToPDF(resume)
        break
      case 'html':
        await this.exportToHTML(resume)
        break
      case 'text':
        await this.exportToText(resume)
        break
      default:
        message.error('不支持的导出格式')
    }
  }
}

export default ResumeExporter