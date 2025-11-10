export interface Resume {
  id: string
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  projects: ProjectReference[]
  summary: string
  template: ResumeTemplate
  createdAt: string
  updatedAt: string
}

export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  github?: string
  linkedin?: string
  bio: string
  photo?: string
  gender?: string
  age?: string
  hometown?: string
  height?: string
  marriageStatus?: string
  politicalStatus?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  achievements: string[]
  technologies: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: number
  description?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  years: number
  description?: string
}

export interface ProjectReference {
  projectId: string
  role: string
  contribution: string
  highlights: string[]
}

export type ResumeTemplate = 'modern' | 'classic' | 'creative' | 'minimal'

export interface ResumeState {
  resume: Resume | null
  loading: boolean
  error: string | null
  generating: boolean
}