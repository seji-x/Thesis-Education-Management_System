'use client'

import PageTitle from '@/components/common/PageTitle'
import { Role } from '@/helper/enums'
import { RootState } from '@/redux'
import { useSelector } from 'react-redux'
import StudentDashBoard from '../StudentDashBoard'
import AdminDashboard from '../AdminDashboard'

export default function DashBoard() {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div>
      <PageTitle title="Dashboard" />
      {user?.role === Role.STUDENT && <StudentDashBoard />}
      {user?.role === Role.ADMIN && <AdminDashboard />}
    </div>
  )
}
