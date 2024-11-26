'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { FaPlus } from 'react-icons/fa'

import { Role } from '@/helper/enums'
import { updateSearchParams } from '@/helper/logics'
import { RootState } from '@/redux'
import { useGet } from '@/hooks/useGet'
import useDebounce from '@/hooks/useDebounce'
import { classEndpoint } from '@/config/endpoints'
import { IClass } from '@/types'
import { MdOutlineNotificationsActive } from 'react-icons/md'

interface Props {
  onClickNotification?: () => void
}

export default function TopBar({ onClickNotification }: Props) {
  const { user } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filter, setFilter] = useState<{
    search: string
    classId: string
  }>({
    search: searchParams.get('search') || '',
    classId: searchParams.get('classId') || '',
  })
  const filterDebounce = useDebounce(filter)

  useEffect(() => {
    router.replace(updateSearchParams(filterDebounce))
  }, [filterDebounce])

  const { response, pending } = useGet<{ results: IClass[] }>({
    url: classEndpoint.BASE,
  })

  return (
    <div className="grid grid-cols-4 gap-5">
      <Input
        color="primary"
        label="Search"
        placeholder="Name/Email"
        size="sm"
        variant="bordered"
        value={filter.search}
        onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
      />
      <Select
        color="primary"
        label="Class"
        size="sm"
        variant="bordered"
        isLoading={pending}
        value={filter.classId}
        onChange={(e) => {
          setFilter((prev) => ({
            ...prev,
            classId: e.target.value,
          }))
        }}
      >
        {(response?.results || []).map((_class) => (
          <SelectItem key={_class.id}>{_class.name}</SelectItem>
        ))}
      </Select>
      {user?.role === Role.ADMIN && (
        <>
          <Button color="primary" endContent={<FaPlus />} size="lg" onClick={() => router.push('/student/create')}>
            Create
          </Button>
          <Button color="primary" isIconOnly size="lg" className="text-lg" onClick={onClickNotification}>
            <MdOutlineNotificationsActive />
          </Button>
        </>
      )}
    </div>
  )
}
