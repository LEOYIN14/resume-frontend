import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Project, ProjectState } from '../../types/project'

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  currentProject: null,
}

// 模拟项目数据
const mockProjects: Project[] = [
  {
    id: '1',
    title: '个人简历管理系统',
    description: '基于React和Ant Design的个人简历管理系统，支持项目管理和技能展示',
    status: 'completed',
    priority: 'high',
    technologies: ['React', 'TypeScript', 'Ant Design'],
    tags: ['前端', '管理系统'],
    startDate: new Date('2024-01-01').toISOString(),
    endDate: new Date('2024-03-01').toISOString(),
    documents: [],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString()
  },
  {
    id: '2',
    title: 'AI营销实验室',
    description: 'AI驱动的营销工具平台，包含内容生成、数据分析等功能',
    status: 'in-progress',
    priority: 'high',
    technologies: ['Python', 'FastAPI', 'React'],
    tags: ['AI', '营销', '数据分析'],
    startDate: new Date('2024-02-01').toISOString(),
    endDate: undefined,
    documents: [],
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// 异步操作
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 从localStorage获取项目数据，如果没有则使用模拟数据
    const storedProjects = localStorage.getItem('projects')
    if (storedProjects) {
      return JSON.parse(storedProjects)
    }
    
    // 保存模拟数据到localStorage
    localStorage.setItem('projects', JSON.stringify(mockProjects))
    return mockProjects
  }
)

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // 从localStorage获取现有项目
    const storedProjects = localStorage.getItem('projects')
    const existingProjects = storedProjects ? JSON.parse(storedProjects) : mockProjects
    
    // 添加新项目
    const updatedProjects = [...existingProjects, newProject]
    
    // 保存到localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects))
    
    return newProject
  }
)

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 从localStorage获取项目数据
    const storedProjects = localStorage.getItem('projects')
    const projects = storedProjects ? JSON.parse(storedProjects) : mockProjects
    
    const project = projects.find((p: Project) => p.id === id)
    if (!project) {
      throw new Error('项目不存在')
    }
    
    return project
  }
)

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (project: Project) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 从localStorage获取项目数据
    const storedProjects = localStorage.getItem('projects')
    const projects = storedProjects ? JSON.parse(storedProjects) : mockProjects
    
    // 更新项目
    const updatedProjects = projects.map((p: Project) => 
      p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p
    )
    
    // 保存到localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects))
    
    return { ...project, updatedAt: new Date().toISOString() }
  }
)





const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取项目列表失败'
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload)
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProject = action.payload
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取项目详情失败'
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        state.currentProject = action.payload
      })
  },
})

export const { setCurrentProject, clearError } = projectSlice.actions
export default projectSlice.reducer