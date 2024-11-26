'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Checkbox } from '@nextui-org/checkbox'
import { FaPlus } from 'react-icons/fa'

import { Role } from '@/helper/enums'
import { updateSearchParams } from '@/helper/logics'
import { RootState } from '@/redux'
import useDebounce from '@/hooks/useDebounce'

export default function TopBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)
  const [filter, setFilter] = useState<Record<string, any>>({
    search: searchParams.get('search') || '',
  })

  const filterDebounce = useDebounce(filter)

  useEffect(() => {
    const newSeachParams = new URLSearchParams()

    for (const key in filter) {
      if (filter[key]) newSeachParams.set(key, filter[key])
    }

    router.replace(pathname + `?${newSeachParams.toString()}`)
  }, [filterDebounce])

  const handleChangeChecked = (checked: boolean) => {
    router.replace(
      updateSearchParams({
        assignee_to: checked ? 'true' : undefined,
      }),
    )
  }

  return (
    <div className="grid grid-cols-4 gap-5">
      <Input
        color="primary"
        label="Search"
        size="sm"
        value={filter.search}
        variant="bordered"
        onChange={(e) => {
          if (!e.target.value.startsWith(' ')) setFilter((prev) => ({ ...prev, search: e.target.value }))
        }}
      />
      {user?.role === Role.TEACHER && (
        <Checkbox checked={searchParams.get('assignee_to') === 'true'} onValueChange={handleChangeChecked}>
          Assignee to me
        </Checkbox>
      )}
      {user?.role === Role.ADMIN && (
        <Button color="primary" endContent={<FaPlus />} size="lg" onClick={() => router.push('/class/create')}>
          Create
        </Button>
      )}
    </div>
  )
}
