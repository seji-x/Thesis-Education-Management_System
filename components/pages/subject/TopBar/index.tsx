'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { FaPlus } from 'react-icons/fa'
import useDebounce from '@/hooks/useDebounce'
import { updateSearchParams } from '@/helper/logics'

export default function TopBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const searchDebounced = useDebounce(search)

  useEffect(() => {
    if (searchDebounced !== searchParams.get('search'))
      router.replace(
        updateSearchParams({
          search: searchDebounced,
        }),
      )
  }, [searchDebounced])

  return (
    <div className="grid grid-cols-4 gap-5">
      <Input
        color="primary"
        label="Search"
        placeholder="Name/Key"
        size="sm"
        variant="bordered"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button color="primary" endContent={<FaPlus />} size="lg" onClick={() => router.push('/subject/create')}>
        Create
      </Button>
    </div>
  )
}
