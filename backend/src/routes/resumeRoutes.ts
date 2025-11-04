import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { dbRun, dbGet, dbAll } from '../database/init'

const router = express.Router()

// 获取最新简历
router.get('/latest', async (req, res) => {
  try {
    const resume = await dbGet(`
      SELECT * FROM resumes ORDER BY created_at DESC LIMIT 1
    `)
    
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' })
    }
    
    // 解析JSON字段
    const parsedResume = {
      ...resume,
      personalInfo: JSON.parse(resume.personal_info),
      experiences: JSON.parse(resume.experiences || '[]'),
      education: JSON.parse(resume.education || '[]'),
      skills: JSON.parse(resume.skills || '[]'),
      projects: JSON.parse(resume.projects || '[]')
    }
    
    res.json(parsedResume)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume' })
  }
})

// 创建或更新简历
router.post('/', async (req, res) => {
  try {
    const {
      personalInfo,
      experiences = [],
      education = [],
      skills = [],
      projects = [],
      summary = '',
      template = 'modern'
    } = req.body
    
    if (!personalInfo) {
      return res.status(400).json({ error: 'Personal info is required' })
    }
    
    const id = uuidv4()
    const now = dayjs().toISOString()
    
    await dbRun(`
      INSERT INTO resumes (
        id, personal_info, experiences, education, skills, projects,
        summary, template, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      JSON.stringify(personalInfo),
      JSON.stringify(experiences),
      JSON.stringify(education),
      JSON.stringify(skills),
      JSON.stringify(projects),
      summary,
      template,
      now,
      now
    ])
    
    const newResume = await dbGet('SELECT * FROM resumes WHERE id = ?', [id])
    
    res.status(201).json({
      ...newResume,
      personalInfo: JSON.parse(newResume.personal_info),
      experiences: JSON.parse(newResume.experiences || '[]'),
      education: JSON.parse(newResume.education || '[]'),
      skills: JSON.parse(newResume.skills || '[]'),
      projects: JSON.parse(newResume.projects || '[]')
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create resume' })
  }
})

// 更新简历
router.put('/:id', async (req, res) => {
  try {
    const {
      personalInfo,
      experiences,
      education,
      skills,
      projects,
      summary,
      template
    } = req.body
    
    const now = dayjs().toISOString()
    
    await dbRun(`
      UPDATE resumes SET
        personal_info = COALESCE(?, personal_info),
        experiences = COALESCE(?, experiences),
        education = COALESCE(?, education),
        skills = COALESCE(?, skills),
        projects = COALESCE(?, projects),
        summary = COALESCE(?, summary),
        template = COALESCE(?, template),
        updated_at = ?
      WHERE id = ?
    `, [
      personalInfo ? JSON.stringify(personalInfo) : null,
      experiences ? JSON.stringify(experiences) : null,
      education ? JSON.stringify(education) : null,
      skills ? JSON.stringify(skills) : null,
      projects ? JSON.stringify(projects) : null,
      summary,
      template,
      now,
      req.params.id
    ])
    
    const updatedResume = await dbGet('SELECT * FROM resumes WHERE id = ?', [req.params.id])
    
    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found' })
    }
    
    res.json({
      ...updatedResume,
      personalInfo: JSON.parse(updatedResume.personal_info),
      experiences: JSON.parse(updatedResume.experiences || '[]'),
      education: JSON.parse(updatedResume.education || '[]'),
      skills: JSON.parse(updatedResume.skills || '[]'),
      projects: JSON.parse(updatedResume.projects || '[]')
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resume' })
  }
})

// 获取简历历史版本
router.get('/history', async (req, res) => {
  try {
    const resumes = await dbAll(`
      SELECT id, template, summary, created_at, updated_at 
      FROM resumes 
      ORDER BY created_at DESC
    `)
    
    res.json(resumes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume history' })
  }
})

export default router