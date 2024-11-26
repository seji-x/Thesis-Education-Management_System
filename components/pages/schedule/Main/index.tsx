'use client'

import { scheduleEndpoint } from '@/config/endpoints'
import { useGet } from '@/hooks/useGet'
import { ISchedule } from '@/types'
import ScheduleCommon from '@/components/common/Schedule'
import PageTitle from '@/components/common/PageTitle'

export default function Schedule() {
  const { response } = useGet<{ results: ISchedule[] }>({
    url: scheduleEndpoint.BASE,
  })

  return (
    <div>
      <PageTitle title="Schedule" />
      <div>
        <ScheduleCommon schedules={response?.results || []} className="mt-10 max-w-screen-lg mx-auto" />
      </div>
    </div>
  )
}
