import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { cleanCLientCookie, setClientCookie } from '@/services/clientCookies'
import { IUser } from '@/types'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/config/constants'

interface Auth {
  user: IUser | null
}

const initialState: Auth = {
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    actionLogout: (state) => {
      state.user = null
      cleanCLientCookie()
    },
    actionLogin: (state, action: PayloadAction<{ refresh: string; access: string; user: IUser }>) => {
      setClientCookie(REFRESH_TOKEN, action.payload.refresh, {
        expires: 30,
      })
      setClientCookie(ACCESS_TOKEN, action.payload.access)
      state.user = action.payload.user
    },
    actionSetUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
  },
})

export const { actionLogout, actionLogin, actionSetUser } = authSlice.actions

export default authSlice.reducer
