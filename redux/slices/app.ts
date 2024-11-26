import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { ISetting } from '@/types'
import { axiosInstance } from '@/services/axiosInstance'
import { settingEndpoint } from '@/config/endpoints'
import { DEFAULT_SCORE_SCHEMA } from '@/helper/datas'

interface App {
  scoreSchema: ISetting['SCORE_SCHEMA'] | null
}

const initialState: App = {
  scoreSchema: DEFAULT_SCORE_SCHEMA,
}

export const fetchSettingThunk = createAsyncThunk('app/fetchSetting', async () => {
  const data = await axiosInstance.get(settingEndpoint.BASE)
  return data.data.results?.[0] as ISetting | undefined
})

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(fetchSettingThunk.fulfilled, (state, action) => {
      if (action.payload?.SCORE_SCHEMA) state.scoreSchema = action.payload.SCORE_SCHEMA
    })
  },
})

export const {} = appSlice.actions

export default appSlice.reducer
