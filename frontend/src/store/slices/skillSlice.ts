import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Skill, SkillState } from '../../types/skill'

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
  categories: [],
}

// 异步操作
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async () => {
    const response = await fetch('/api/skills')
    return await response.json()
  }
)

export const createSkill = createAsyncThunk(
  'skills/createSkill',
  async (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    })
    return await response.json()
  }
)

export const fetchCategories = createAsyncThunk(
  'skills/fetchCategories',
  async () => {
    const response = await fetch('/api/skills/categories')
    return await response.json()
  }
)

const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false
        state.skills = action.payload
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取技能列表失败'
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload)
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { clearError } = skillSlice.actions
export default skillSlice.reducer