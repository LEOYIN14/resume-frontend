export interface Skill {
  id: string
  name: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  years: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface SkillState {
  skills: Skill[]
  loading: boolean
  error: string | null
  categories: Array<{
    category: string
    count: number
  }>
}