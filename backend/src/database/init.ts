import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'resume.db')

// 确保数据目录存在
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// 创建数据库连接
const db = new sqlite3.Database(dbPath)

// 将回调方法转换为Promise
const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const dbAll = promisify(db.all.bind(db))

export async function initDatabase() {
  try {
    // 创建项目表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        technologies TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        status TEXT CHECK(status IN ('planning', 'in-progress', 'completed', 'on-hold')),
        priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
        tags TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // 创建文档表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('pdf', 'doc', 'image', 'code', 'other')),
        url TEXT NOT NULL,
        size INTEGER,
        uploaded_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `)

    // 创建技能表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced', 'expert')),
        years INTEGER DEFAULT 0,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // 创建简历表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        personal_info TEXT NOT NULL,
        experiences TEXT,
        education TEXT,
        skills TEXT,
        projects TEXT,
        summary TEXT,
        template TEXT CHECK(template IN ('modern', 'classic', 'creative', 'minimal')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // 创建AI使用记录表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS ai_usage (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        input_tokens INTEGER,
        output_tokens INTEGER,
        cost REAL,
        timestamp TEXT NOT NULL
      )
    `)

    console.log('Database tables created successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

export { db, dbRun, dbGet, dbAll }