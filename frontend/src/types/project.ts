export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  startDate: string
  endDate?: string
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  documents: Document[]
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'image' | 'code' | 'other'
  url: string
  size: number
  uploadedAt: string
}

export interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  currentProject: Project | null
}