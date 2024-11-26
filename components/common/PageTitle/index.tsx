import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export default function PageTitle({ title, className }: { title: ReactNode; className?: string }) {
  return <h1 className={twMerge('text-3xl font-bold border-b border-gray-950 p-1', className)}>{title}</h1>
}
