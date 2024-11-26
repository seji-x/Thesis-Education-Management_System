import { statisticEndpoint } from '@/config/endpoints'
import { useGet } from '@/hooks/useGet'
import Block from './Block'

interface Statistic {
  total_students: number
  total_teachers: number
  total_users: number
  total_classes: number
  total_subjects: number
}

export default function AdminDashboard() {
  const { response } = useGet<Statistic>({
    url: statisticEndpoint.BASE,
  })

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Block label="Total students" value={response?.total_students} />
        <Block label="Total teachers" value={response?.total_teachers} />
        <Block label="Total classes" value={response?.total_classes} />
        <Block label="Total subjects" value={response?.total_subjects} />
      </div>
    </div>
  )
}
