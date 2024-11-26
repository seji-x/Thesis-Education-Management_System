'use client'

import PageTitle from '@/components/common/PageTitle'

import TopBar from '../TopBar'
import StudentList, { StudentListRef } from '../StudentList'
import { useRef } from 'react'

export default function Student() {
  const studentListRef = useRef<StudentListRef>(null)

  return (
    <div>
      <PageTitle title="Student" />
      <div className="p-1 pt-3 pb-14">
        <TopBar onClickNotification={() => studentListRef.current?.handleNotice()} />
        <StudentList ref={studentListRef} />
      </div>
    </div>
  )
}
