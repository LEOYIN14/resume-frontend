import { configureStore } from '@reduxjs/toolkit'
import projectReducer from './slices/projectSlice'
import resumeReducer from './slices/resumeSlice'
import skillReducer from './slices/skillSlice'
import aiReducer from './slices/aiSlice'

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    resume: resumeReducer,
    skills: skillReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch