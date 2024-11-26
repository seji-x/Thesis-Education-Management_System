import { twMerge } from 'tailwind-merge'
import { daysOfWeek, lessions } from '@/config/constants'
import { ISchedule, TDayOfWeek } from '@/types'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { Role } from '@/helper/enums'

interface Props {
  className?: string
  schedules: ISchedule[]
}

export default function Schedule({ className, schedules }: Props) {
  const { user } = useSelector((state: RootState) => state.auth)

  const getSchedule = (day: TDayOfWeek, lession: number) => {
    const schedule = schedules.find((_schedule) => _schedule.day_of_week === day && lession === _schedule.period)

    return schedule
  }

  return (
    <div className={twMerge('grid grid-cols-8 bg-white', className)}>
      {['--', ...daysOfWeek].map((day) => (
        <div key={day}>
          <div className="text-center border-b py-2">{day}</div>

          {lessions.map((lession) => {
            if (day === '--')
              return (
                <div key={lession} className="text-center h-10 flex items-center justify-center border duration-200">
                  {lession}
                </div>
              )
            const schedule = getSchedule(day as TDayOfWeek, lession)
            if (!schedule)
              return (
                <div
                  key={lession}
                  className="text-center h-10 flex items-center justify-center border duration-200"
                ></div>
              )

            return (
              <div
                key={lession}
                className="text-center h-10 flex items-center justify-center border duration-200 bg-green-300 text-sm"
              >
                {user?.role === Role.TEACHER && `${schedule.class_subject.class_instance.name} -`}{' '}
                {schedule.class_subject.subject.name}
                {user?.role === Role.STUDENT &&
                  `- ${schedule.class_subject.teacher_id?.full_name.charAt(0)}.${schedule.class_subject.teacher_id?.full_name.split(' ').pop()}`}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
