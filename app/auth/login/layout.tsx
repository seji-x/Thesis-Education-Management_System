import Image from 'next/image'
import { ReactNode } from 'react'

import logo from '@/public/images/logo.png'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex justify-center items-center py-10 px-6 bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-5 w-[600px] max-w-full">
        <div className="w-[200px] aspect-video mx-auto pb-5">
          <Image alt="" src={logo} />
        </div>
        {children}
      </div>
    </div>
  )
}
