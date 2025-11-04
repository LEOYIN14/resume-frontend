import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface AIUsage {
  monthly: {
    total_requests: number
    total_input_tokens: number
    total_output_tokens: number
    total_cost: number
  }
  recent: Array<{
    type: string
    input_tokens: number
    output_tokens: number
    cost: number
    timestamp: string
  }>
}

interface AIState {
  usage: AIUsage | null
  loading: boolean
  error: string | null
}

const initialState: AIState = {
  usage: null,
  loading: false,
  error: null,
}

// 异步操作
export const fetchAIUsage = createAsyncThunk(
  'ai/fetchAIUsage',
  async () => {
    const response = await fetch('/api/ai/usage')
    return await response.json()
  }
)

export const analyzeSkills = createAsyncThunk(
  'ai/analyzeSkills',
  async (data: { skills: any[]; targetRole: string }) => {
    const response = await fetch('/api/ai/analyze-skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return await response.json()
  }
)

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIUsage.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAIUsage.fulfilled, (state, action) => {
        state.loading = false
        state.usage = action.payload
      })
      .addCase(fetchAIUsage.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取AI使用统计失败'
      })
  },
})

export const { clearError } = aiSlice.actions
export default aiSlice.reducer