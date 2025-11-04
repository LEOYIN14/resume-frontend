import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { dbRun, dbGet, dbAll } from '../database/init'

const router = express.Router()

// 获取所有技能
router.get('/', async (req, res) => {
  try {
    const skills = await dbAll(`
      SELECT * FROM skills ORDER BY category, name
    `)
    
    res.json(skills)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' })
  }
})

// 按分类获取技能
router.get('/categories/:category', async (req, res) => {
  try {
    const skills = await dbAll(`
      SELECT * FROM skills 
      WHERE category = ? 
      ORDER BY level DESC, years DESC
    `, [req.params.category])
    
    res.json(skills)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills by category' })
  }
})

// 添加新技能
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      level = 'intermediate',
      years = 0,
      description = ''
    } = req.body
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' })
    }
    
    const id = uuidv4()
    const now = dayjs().toISOString()
    
    await dbRun(`
      INSERT INTO skills (id, name, category, level, years, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, name, category, level, years, description, now, now])
    
    const newSkill = await dbGet('SELECT * FROM skills WHERE id = ?', [id])
    res.status(201).json(newSkill)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' })
  }
})

// 更新技能
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      category,
      level,
      years,
      description
    } = req.body
    
    const now = dayjs().toISOString()
    
    await dbRun(`
      UPDATE skills SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        level = COALESCE(?, level),
        years = COALESCE(?, years),
        description = COALESCE(?, description),
        updated_at = ?
      WHERE id = ?
    `, [name, category, level, years, description, now, req.params.id])
    
    const updatedSkill = await dbGet('SELECT * FROM skills WHERE id = ?', [req.params.id])
    
    if (!updatedSkill) {
      return res.status(404).json({ error: 'Skill not found' })
    }
    
    res.json(updatedSkill)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' })
  }
})

// 删除技能
router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM skills WHERE id = ?', [req.params.id])
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' })
  }
})

// 获取技能分类
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbAll(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM skills
      GROUP BY category
      ORDER BY count DESC
    `)
    
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skill categories' })
  }
})

export default router