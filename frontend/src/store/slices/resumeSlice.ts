import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Resume, ResumeState } from '../../types/resume'

const initialState: ResumeState = {
  resume: null,
  loading: false,
  error: null,
  generating: false,
}

// 异步操作
export const fetchLatestResume = createAsyncThunk(
  'resume/fetchLatestResume',
  async () => {
    const response = await fetch('/api/resume/latest')
    if (!response.ok) {
      throw new Error('Failed to fetch resume')
    }
    return await response.json()
  }
)

export const generateResume = createAsyncThunk(
  'resume/generateResume',
  async (data: any) => {
    const response = await fetch('/api/ai/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to generate resume')
    }
    return await response.json()
  }
)

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.generating = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestResume.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchLatestResume.fulfilled, (state, action) => {
        state.loading = false
        state.resume = action.payload
      })
      .addCase(fetchLatestResume.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取简历失败'
      })
      .addCase(generateResume.pending, (state) => {
        state.generating = true
      })
      .addCase(generateResume.fulfilled, (state, action) => {
        state.generating = false
      })
      .addCase(generateResume.rejected, (state, action) => {
        state.generating = false
        state.error = action.error.message || '生成简历失败'
      })
  },
})

export const { clearError, setGenerating } = resumeSlice.actions
export default resumeSlice.reducer