'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@nextui-org/pagination'
import { useSelector } from 'react-redux'

import { updateSearchParams } from '@/helper/logics'
import { Role } from '@/helper/enums'
import { useGet } from '@/hooks/useGet'
import { classEndpoint, classSubjectEndpoint } from '@/config/endpoints'
import { IClass, IClassSubject } from '@/types'
import { RootState } from '@/redux'

import ClassItem from './ClassItem'

const POST_PER_PAGE = 12

export default function ClassList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const { user } = useSelector((state: RootState) => state.auth)

  const search = searchParams.get('search')
  const assigneeToMe = searchParams.get('assignee_to') === 'true'

  const { response: classes } = useGet<{
    count: number
    results: IClass[]
  }>(
    {
      url: classEndpoint.BASE,
      config: {
        params: {
          limit: POST_PER_PAGE,
          offset: (page - 1) * POST_PER_PAGE,
          search,
          teacher_id: assigneeToMe ? user?.id : undefined,
        },
      },
    },
    {
      deps: [page, search, assigneeToMe],
      disabled: user?.role === Role.TEACHER ? !assigneeToMe : user?.role !== Role.ADMIN,
    },
  )

  const { response: classSubjectResponse } = useGet<{
    count: number
    results: IClassSubject[]
  }>(
    {
      url: classSubjectEndpoint.BASE,
      config: {
        params: {
          teacher_id: user?.id,
          limit: POST_PER_PAGE,
          offset: (page - 1) * POST_PER_PAGE,
          search,
        },
      },
    },
    {
      deps: [page, search, assigneeToMe],
      disabled: user?.role !== Role.TEACHER || assigneeToMe,
    },
  )

  return (
    <div className="mt-10">
      <div className="grid grid-cols-4 gap-6">
        {(user?.role === Role.ADMIN || assigneeToMe ? classes?.results || [] : []).map((_class) => (
          <ClassItem
            key={_class.id}
            id={_class.id}
            name={_class.name}
            year={_class.year}
            student_count={_class.student_count}
            teacher={_class.teacher}
          />
        ))}
        {(assigneeToMe ? [] : classSubjectResponse?.results || []).map(({ class_instance, subject, id, status }) => (
          <ClassItem
            key={id}
            id={class_instance.id}
            name={class_instance.name}
            year={class_instance.year}
            subject={subject.name}
            classSubject={id}
            statusClassSubject={status}
            student_count={class_instance.student_count}
            teacher={null}
          />
        ))}
      </div>
      <Pagination
        showControls
        showShadow
        className="mt-10 flex justify-center"
        page={page}
        total={Math.ceil((classes?.count || classSubjectResponse?.count || 0) / POST_PER_PAGE)}
        onChange={(page) => {
          router.replace(
            updateSearchParams({
              page,
            }),
          )
        }}
      />
    </div>
  )
}
