import { configureStore } from '@reduxjs/toolkit'

import auth from './slices/auth'
import app from './slices/app'

export const store = configureStore({
  reducer: {
    auth,
    app,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
