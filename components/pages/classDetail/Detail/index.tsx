import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'

import { API_URL } from '@/config/constants'
import { classEndpoint } from '@/config/endpoints'
import { useGet } from '@/hooks/useGet'
import { IClass } from '@/types'
import ChangeAssigneeTeacher from '../ChangeAssigneeTeacher'
import { RootState } from '@/redux'
import { Role } from '@/helper/enums'

export default function Detail() {
  const { id } = useParams()
  const [changing, setChanging] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)

  const { response, reFetch } = useGet<IClass>({
    url: `${classEndpoint.BASE}/${id}`,
  })

  return (
    <div className="flex items-stretch gap-10 justify-center">
      <div className="aspect-square rounded-full bg-white w-48">
        <Avatar
          src={`${API_URL}/${response?.teacher?.avatar}`}
          showFallback
          name={response?.name}
          className="w-full h-full text-4xl"
        />
      </div>
      <div>
        <p className="text-4xl font-bold">{response?.name}</p>
        <p className="mt-3">{response?.year}</p>
        {response?.teacher && (
          <p className="text-xl font-bold text-blue-900">
            <span className="text-sm font-semibold text-gray-900">Assignee teacher:</span> {response.teacher.full_name}
          </p>
        )}
        {user?.role === Role.ADMIN && (
          <Button color="primary" className="mt-4" onClick={() => setChanging(true)}>
            Change assignee teacher
          </Button>
        )}
      </div>
      <ChangeAssigneeTeacher
        changing={changing}
        classId={id as string}
        onClose={() => setChanging(false)}
        onUpdated={() => {
          setChanging(false)
          reFetch()
        }}
      />
    </div>
  )
}
