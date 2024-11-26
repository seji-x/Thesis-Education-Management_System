import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Avatar } from '@nextui-org/avatar'
import { IClass, TClassSubjectStatus } from '@/types'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { Role } from '@/helper/enums'
import toast from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'
import { API_URL } from '@/config/constants'

export default function ClassItem({
  id,
  name,
  subject,
  classSubject,
  statusClassSubject,
  student_count,
  teacher,
}: Omit<IClass, 'key'> & {
  subject?: string
  classSubject?: string
  statusClassSubject?: TClassSubjectStatus
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)
  const assigneeToMe = searchParams.get('assignee_to') === 'true'

  return (
    <Card
      isPressable
      className="aspect-square cursor-pointer"
      onClick={() => {
        if (user?.role === Role.TEACHER && statusClassSubject === 'CLOSED') {
          toast.success('Class got closed')
          return
        } else {
          const url = assigneeToMe
            ? `/class/${id}/assignee`
            : `/class/${id}${classSubject ? `?cs_id=${classSubject}` : ''}`
          router.push(url)
        }
      }}
    >
      <CardHeader
        className={twMerge(
          'flex-col items-start p-5 relative z-0 text-white',
          statusClassSubject === 'CLOSED' ? 'bg-gray-600' : 'bg-blue-600',
        )}
      >
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-sm">{student_count} students</p>
        <Avatar
          src={`${API_URL}${teacher?.avatar}`}
          className="absolute top-full -translate-y-5 z-20 right-4 w-1/4 !aspect-square h-[unset]"
        />
      </CardHeader>

      <CardBody className="relative z-10">
        <p>{subject}</p>
        <p className="w-2/3">
          Assignee teacher: <strong>{teacher?.full_name || '--'}</strong>
        </p>
      </CardBody>
    </Card>
  )
}
