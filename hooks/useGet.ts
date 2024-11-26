import { DependencyList, useEffect, useState } from 'react'
import { AxiosRequestConfig } from 'axios'

import { axiosInstance } from '@/services/axiosInstance'

export const useGet = <T = unknown>(
  { url, config }: { url: string; config?: AxiosRequestConfig },
  options?: {
    disabled?: boolean
    deps?: DependencyList
  },
) => {
  const [data, setData] = useState<{
    pending: boolean
    response: T | null
    error: unknown | null
  }>({
    pending: true,
    response: null,
    error: null,
  })

  const getData = async () => {
    try {
      setData((prev) => ({
        ...prev,
        pending: true,
      }))
      const response = await axiosInstance.get(url, config)

      setData({
        error: null,
        pending: false,
        response: response.data,
      })
    } catch (error) {
      setData({
        error: error,
        pending: false,
        response: null,
      })
    }
  }

  useEffect(() => {
    if (options?.disabled) return
    getData()
  }, [url, options?.disabled, ...(options?.deps || [])])

  const reFetch = () => {
    if (data.pending || options?.disabled) return
    getData()
  }

  return { ...data, reFetch }
}
