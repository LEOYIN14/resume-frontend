import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import axios from 'axios'
import { dbRun, dbGet, dbAll } from '../database/init'

const router = express.Router()

// DeepSeek API配置
const DEEPSEEK_CONFIG = {
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '2000'),
  temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7')
}

// 成本计算（DeepSeek定价）
const calculateCost = (inputTokens: number, outputTokens: number): number => {
  // DeepSeek定价：输入$0.000014/1K tokens，输出$0.000028/1K tokens
  const inputCost = (inputTokens / 1000) * 0.000014
  const outputCost = (outputTokens / 1000) * 0.000028
  return inputCost + outputCost
}

// 记录AI使用情况
async function recordAIUsage(type: string, inputTokens: number, outputTokens: number, cost: number) {
  const id = uuidv4()
  const timestamp = dayjs().toISOString()
  
  await dbRun(`
    INSERT INTO ai_usage (id, type, input_tokens, output_tokens, cost, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, type, inputTokens, outputTokens, cost, timestamp])
}

// 获取本月使用统计
async function getMonthlyUsage() {
  const startOfMonth = dayjs().startOf('month').toISOString()
  
  const usage = await dbGet(`
    SELECT 
      COUNT(*) as total_requests,
      SUM(input_tokens) as total_input_tokens,
      SUM(output_tokens) as total_output_tokens,
      SUM(cost) as total_cost
    FROM ai_usage 
    WHERE timestamp >= ?
  `, [startOfMonth])
  
  return usage || {
    total_requests: 0,
    total_input_tokens: 0,
    total_output_tokens: 0,
    total_cost: 0
  }
}

// AI生成简历内容
router.post('/generate-resume', async (req, res) => {
  try {
    const { projects, skills, personalInfo, template } = req.body
    
    if (!DEEPSEEK_CONFIG.apiKey) {
      return res.status(400).json({ error: 'DeepSeek API key not configured' })
    }
    
    // 构建提示词
    const prompt = `
基于以下信息生成一份专业简历：

个人信息：
- 姓名：${personalInfo.name || '未提供'}
- 职位：${personalInfo.title || '未提供'}
- 简介：${personalInfo.bio || '未提供'}

项目经验（${projects.length}个）：
${projects.map((p: any) => `- ${p.title}: ${p.description}`).join('\n')}

技能列表（${skills.length}项）：
${skills.map((s: any) => `- ${s.name} (${s.level}, ${s.years}年)`).join('\n')}

请生成一份结构清晰、专业、突出技术能力的简历内容，使用${template}模板风格。
    `.trim()
    
    const response = await axios.post(
      `${DEEPSEEK_CONFIG.baseUrl}/chat/completions`,
      {
        model: DEEPSEEK_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的简历撰写助手，擅长根据用户的项目经验和技能生成专业、有吸引力的简历内容。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: DEEPSEEK_CONFIG.maxTokens,
        temperature: DEEPSEEK_CONFIG.temperature
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const result = response.data.choices[0].message.content
    const usage = response.data.usage
    
    // 计算并记录成本
    const cost = calculateCost(usage.prompt_tokens, usage.completion_tokens)
    await recordAIUsage('resume_generation', usage.prompt_tokens, usage.completion_tokens, cost)
    
    res.json({
      content: result,
      usage: {
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        cost: cost
      }
    })
    
  } catch (error: any) {
    console.error('AI generation error:', error.response?.data || error.message)
    res.status(500).json({ 
      error: 'AI generation failed',
      details: error.response?.data?.error?.message || error.message 
    })
  }
})

// 获取AI使用统计
router.get('/usage', async (req, res) => {
  try {
    const monthlyUsage = await getMonthlyUsage()
    
    // 获取最近的使用记录
    const recentUsage = await dbAll(`
      SELECT type, input_tokens, output_tokens, cost, timestamp
      FROM ai_usage
      ORDER BY timestamp DESC
      LIMIT 10
    `)
    
    res.json({
      monthly: monthlyUsage,
      recent: recentUsage
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI usage' })
  }
})

// 技能分析建议
router.post('/analyze-skills', async (req, res) => {
  try {
    const { skills, targetRole } = req.body
    
    if (!DEEPSEEK_CONFIG.apiKey) {
      return res.status(400).json({ error: 'DeepSeek API key not configured' })
    }
    
    const prompt = `
分析以下技能组合对于${targetRole}职位的匹配度，并提供改进建议：

当前技能：
${skills.map((s: any) => `- ${s.name}: ${s.level}水平，${s.years}年经验`).join('\n')}

请分析：
1. 技能与目标职位的匹配度
2. 需要加强的技能领域
3. 建议学习的新技能
4. 职业发展建议
    `.trim()
    
    const response = await axios.post(
      `${DEEPSEEK_CONFIG.baseUrl}/chat/completions`,
      {
        model: DEEPSEEK_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: '你是一个职业发展顾问，擅长分析技能组合并提供职业发展建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const result = response.data.choices[0].message.content
    const usage = response.data.usage
    
    // 计算并记录成本
    const cost = calculateCost(usage.prompt_tokens, usage.completion_tokens)
    await recordAIUsage('skill_analysis', usage.prompt_tokens, usage.completion_tokens, cost)
    
    res.json({
      analysis: result,
      usage: {
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        cost: cost
      }
    })
    
  } catch (error: any) {
    console.error('Skill analysis error:', error.response?.data || error.message)
    res.status(500).json({ 
      error: 'Skill analysis failed',
      details: error.response?.data?.error?.message || error.message 
    })
  }
})

export default router