'use client'

import { ReactNode, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

import { AppDispatch, RootState } from '@/redux'
import { fetchSettingThunk } from '@/redux/slices/app'
import { actionLogout, actionSetUser } from '@/redux/slices/auth'
import { getClientCookie } from '@/services/clientCookies'
import { axiosInstance } from '@/services/axiosInstance'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/config/constants'
import { userEndpoint } from '@/config/endpoints'

import Header from '@/components/layouts/Header'
import SideBar from '@/components/layouts/SideBar'

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth)
  const [collapsed, setCollapsed] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  useLayoutEffect(() => {
    const getMe = async () => {
      try {
        const response = await axiosInstance.get(userEndpoint.GET_ME)
        dispatch(actionSetUser(response.data))
        setReady(true)
      } catch (error) {
        dispatch(actionLogout())
        router.replace('/auth/login')
      }
    }

    if (user?.id) {
      setReady(true)
      return
    }
    const access = getClientCookie(ACCESS_TOKEN)
    const refresh = getClientCookie(REFRESH_TOKEN)
    if (access || refresh) {
      getMe()
      return
    }

    router.replace('/auth/login')
  }, [])

  const handleResize = () => {
    if (window.innerWidth < 1280 && !collapsed) setCollapsed(true)

    if (window.innerWidth > 1550 && collapsed) setCollapsed(false)
  }

  useEffect(() => {
    handleResize()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [collapsed])

  useEffect(() => {
    dispatch(fetchSettingThunk())
  }, [])

  if (!ready) return null

  return (
    <Suspense>
      <div className="w-dvw h-dvh flex bg-gray-100">
        <SideBar collapsed={collapsed} />
        <div className="grow h-full overflow-y-auto flex flex-col">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className="grow w-full overflow-y-auto px-4 pt-2">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
