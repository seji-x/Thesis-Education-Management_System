import { useState } from 'react'
import { AxiosRequestConfig } from 'axios'

import { axiosInstance } from '@/services/axiosInstance'

export const useMutation = <T = unknown>() => {
  const [pending, setPending] = useState(false)

  return {
    pending,
    mutation: async ({
      url,
      config,
      body,
      method,
    }: {
      url: string
      method: 'post' | 'put' | 'patch' | 'delete'
      body?: any
      config?: AxiosRequestConfig
    }): Promise<{
      response: T | null
      error: null | any
    }> => {
      try {
        setPending(true)
        const response = await axiosInstance({
          url,
          method,
          ...config,
          data: body,
        })

        return {
          response: response.data,
          error: null,
        }
      } catch (error) {
        return {
          response: null,
          error,
        }
      } finally {
        setPending(false)
      }
    },
  }
}
