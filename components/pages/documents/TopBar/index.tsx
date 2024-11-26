import { subjectEndpoint } from '@/config/endpoints'
import { Role } from '@/helper/enums'
import { updateSearchParams } from '@/helper/logics'
import useDebounce from '@/hooks/useDebounce'
import { useGet } from '@/hooks/useGet'
import { RootState } from '@/redux'
import { ISubject } from '@/types'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useSelector } from 'react-redux'

export default function TopBar() {
  const { user } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState<{
    search: string
    subjectID: string
  }>({
    search: searchParams.get('search') || '',
    subjectID: searchParams.get('subjectID') || '',
  })
  const filterDebounce = useDebounce(filter)

  useEffect(() => {
    router.replace(updateSearchParams(filterDebounce))
  }, [filterDebounce])
  const { response: subjectResponse } = useGet<{
    results: ISubject[]
  }>({
    url: subjectEndpoint.BASE,
  })

  return (
    <div className="grid grid-cols-4 gap-5 mt-6">
      <Input
        color="primary"
        label="Search"
        placeholder="Name/Email"
        size="sm"
        value={filter.search}
        variant="bordered"
        onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
      />

      <Select
        color="primary"
        label="Subject"
        size="sm"
        variant="bordered"
        value={filter.subjectID}
        onChange={(e) => {
          setFilter((prev) => ({
            ...prev,
            subjectID: e.target.value,
          }))
        }}
      >
        {(subjectResponse?.results || []).map((subject) => (
          <SelectItem key={subject.id}>{subject.name}</SelectItem>
        ))}
      </Select>

      {user?.role === Role.ADMIN && (
        <Button color="primary" endContent={<FaPlus />} size="lg" onClick={() => router.push('/documents/create')}>
          Create
        </Button>
      )}
    </div>
  )
}
