import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import projectRoutes from './routes/projectRoutes'
import resumeRoutes from './routes/resumeRoutes'
import skillRoutes from './routes/skillRoutes'
import aiRoutes from './routes/aiRoutes'
import { errorHandler } from './middleware/errorHandler'
import { initDatabase } from './database/init'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// 中间件
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
app.use('/uploads', express.static('uploads'))

// 路由
app.use('/api/projects', projectRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/ai', aiRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// 错误处理
app.use(errorHandler)

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  })
})

// 初始化数据库并启动服务器
async function startServer() {
  try {
    await initDatabase()
    console.log('Database initialized successfully')
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app