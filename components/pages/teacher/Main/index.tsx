'use client'

import { useRef } from 'react'
import PageTitle from '@/components/common/PageTitle'

import TopBar from '../TopBar'
import TeacherList, { TeacherListRef } from '../TeacherList'

export default function Teacher() {
  const teacherListRef = useRef<TeacherListRef>(null)

  return (
    <div>
      <PageTitle title="Teacher" />
      <div className="p-1 pt-3 pb-14">
        <TopBar onClickNotification={() => teacherListRef.current?.handleNotice()} />
        <TeacherList ref={teacherListRef} />
      </div>
    </div>
  )
}
