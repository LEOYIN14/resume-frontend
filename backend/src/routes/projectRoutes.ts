import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { dbRun, dbGet, dbAll } from '../database/init'

const router = express.Router()

// 获取所有项目
router.get('/', async (req, res) => {
  try {
    const projects = await dbAll(`
      SELECT * FROM projects ORDER BY created_at DESC
    `)
    
    // 解析JSON字段
    const parsedProjects = projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies || '[]'),
      tags: JSON.parse(project.tags || '[]')
    }))
    
    res.json(parsedProjects)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// 获取单个项目
router.get('/:id', async (req, res) => {
  try {
    const project = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id])
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    // 获取项目相关文档
    const documents = await dbAll('SELECT * FROM documents WHERE project_id = ?', [req.params.id])
    
    // 解析JSON字段
    const parsedProject = {
      ...project,
      technologies: JSON.parse(project.technologies || '[]'),
      tags: JSON.parse(project.tags || '[]'),
      documents
    }
    
    res.json(parsedProject)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// 创建新项目
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      technologies = [],
      startDate,
      endDate,
      status = 'planning',
      priority = 'medium',
      tags = []
    } = req.body
    
    if (!title || !startDate) {
      return res.status(400).json({ error: 'Title and start date are required' })
    }
    
    const id = uuidv4()
    const now = dayjs().toISOString()
    
    await dbRun(`
      INSERT INTO projects (
        id, title, description, technologies, start_date, end_date, 
        status, priority, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, title, description, 
      JSON.stringify(technologies), 
      startDate, endDate, 
      status, priority, 
      JSON.stringify(tags), 
      now, now
    ])
    
    const newProject = await dbGet('SELECT * FROM projects WHERE id = ?', [id])
    
    res.status(201).json({
      ...newProject,
      technologies: JSON.parse(newProject.technologies || '[]'),
      tags: JSON.parse(newProject.tags || '[]')
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// 更新项目
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      startDate,
      endDate,
      status,
      priority,
      tags
    } = req.body
    
    const now = dayjs().toISOString()
    
    await dbRun(`
      UPDATE projects SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        technologies = COALESCE(?, technologies),
        start_date = COALESCE(?, start_date),
        end_date = ?,
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        tags = COALESCE(?, tags),
        updated_at = ?
      WHERE id = ?
    `, [
      title, description, 
      technologies ? JSON.stringify(technologies) : null,
      startDate, endDate, status, priority,
      tags ? JSON.stringify(tags) : null,
      now, req.params.id
    ])
    
    const updatedProject = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id])
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json({
      ...updatedProject,
      technologies: JSON.parse(updatedProject.technologies || '[]'),
      tags: JSON.parse(updatedProject.tags || '[]')
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// 删除项目
router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM projects WHERE id = ?', [req.params.id])
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

export default router