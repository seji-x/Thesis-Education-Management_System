import { useState } from 'react'
import { useParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import toast from 'react-hot-toast'

import { Button } from '@nextui-org/button'
import { FaPlus } from 'react-icons/fa'
import { TiDelete } from 'react-icons/ti'

import { daysOfWeek, lessions } from '@/config/constants'
import { scheduleEndpoint } from '@/config/endpoints'
import { useGet } from '@/hooks/useGet'
import { ISchedule, TDayOfWeek } from '@/types'
import { useMutation } from '@/hooks/useMutation'

interface Props {
  teacherId?: string
  classSubjectId: string
}

export default function Schedule({ classSubjectId, teacherId }: Props) {
  const { id: classId } = useParams()
  const [mutatingCell, setMutatingCell] = useState<{
    day: TDayOfWeek | null
    lession: number | null
  }>({
    day: null,
    lession: null,
  })

  const {
    response: teacherScledule,
    pending: teacherSchedulePending,
    reFetch: reFetchTeacherScledule,
  } = useGet<{
    results: ISchedule[]
  }>({
    url: scheduleEndpoint.BASE,
    config: {
      params: {
        teacher_id: teacherId,
      },
    },
  })
  const {
    response: classSubjectSchedule,
    pending: classSubjectSchedulePending,
    reFetch: reFetchClassSubjectSchedule,
  } = useGet<{
    results: ISchedule[]
  }>({
    url: scheduleEndpoint.BASE,
    config: {
      params: {
        class_subject_id: classSubjectId,
      },
    },
  })
  const {
    response: classSchedule,
    pending: classSchedulePending,
    reFetch: reFetchClassSchedule,
  } = useGet<{
    results: ISchedule[]
  }>({
    url: scheduleEndpoint.BASE,
    config: {
      params: {
        class_instance_id: classId,
      },
    },
  })

  const addScheduleMutation = useMutation()
  const removeScheduleMutation = useMutation()

  const checkAvailable = (day: TDayOfWeek, lession: (typeof lessions)[number]) => {
    if (teacherScledule?.results && classSchedule?.results && classSubjectSchedule?.results) {
      return (
        (!classSchedule.results.some((schedule) => schedule.day_of_week === day && schedule.period === lession) &&
          !teacherScledule.results.some((schedule) => schedule.day_of_week === day && schedule.period === lession)) ||
        classSubjectSchedule.results.some((schedule) => schedule.day_of_week === day && schedule.period === lession)
      )
    } else return true
  }

  const checkSetted = (day: TDayOfWeek, lession: (typeof lessions)[number]) => {
    if (teacherScledule?.results && classSchedule?.results && classSubjectSchedule?.results) {
      return classSubjectSchedule.results.some(
        (schedule) => schedule.day_of_week === day && schedule.period === lession,
      )
    } else return false
  }

  const handleAddSchedule = async (day: TDayOfWeek, lession: number) => {
    setMutatingCell({
      day,
      lession,
    })
    const { error } = await addScheduleMutation.mutation({
      url: scheduleEndpoint.BASE,
      method: 'post',
      body: {
        day_of_week: day,
        period: lession,
        class_subject: classSubjectId,
      },
    })

    setMutatingCell({
      day: null,
      lession: null,
    })

    if (error) {
      toast.error(error?.data?.response?.detail || 'Can not create schedule')
      return
    }

    reFetchClassSchedule()
    reFetchClassSubjectSchedule()
    reFetchTeacherScledule()
  }

  const handleRemoveSchedule = async (day: TDayOfWeek, lession: number) => {
    const schedule = classSubjectSchedule?.results.find(
      (schedule) => schedule.day_of_week === day && schedule.period === lession,
    )
    if (!schedule) return
    setMutatingCell({
      day,
      lession,
    })

    const { error } = await removeScheduleMutation.mutation({
      url: `${scheduleEndpoint.BASE}/${schedule.id}`,
      method: 'delete',
    })

    setMutatingCell({
      day: null,
      lession: null,
    })

    if (error) {
      toast.error(error?.data?.response?.detail || 'Can not remove schedule')
      return
    }

    reFetchClassSchedule()
    reFetchClassSubjectSchedule()
    reFetchTeacherScledule()
  }

  return (
    <div className="flex flex-col h-dvh w-full p-4">
      <h2 className="text-3xl font-semibold text-center">Schedule</h2>
      <div className="grow">
        <div className="max-w-screen-lg mx-auto mt-4 grid grid-cols-8 relative">
          {['--', ...daysOfWeek].map((day) => (
            <div key={day}>
              <div className="text-center border-b py-2">{day}</div>
              {lessions.map((lession) => (
                <div
                  key={lession}
                  className={twMerge(
                    'text-center h-10 flex items-center justify-center border-b border-r duration-200',
                    day === '--' && 'border-l',
                    !checkAvailable(day as TDayOfWeek, lession) && 'bg-red-300 cursor-not-allowed',
                    checkSetted(day as TDayOfWeek, lession) && 'bg-green-300',
                  )}
                >
                  {day === '--' ? (
                    lession
                  ) : checkAvailable(day as TDayOfWeek, lession) ? (
                    checkSetted(day as TDayOfWeek, lession) ? (
                      <Button
                        variant="light"
                        className="text-transparent hover:text-black data-[loading]:text-black w-full text-lg"
                        radius="none"
                        onClick={() => handleRemoveSchedule(day as TDayOfWeek, lession)}
                        isLoading={
                          removeScheduleMutation.pending && mutatingCell.day === day && mutatingCell.lession === lession
                        }
                        isDisabled={
                          (removeScheduleMutation.pending &&
                            (mutatingCell.day !== day || mutatingCell.lession !== lession)) ||
                          addScheduleMutation.pending ||
                          teacherSchedulePending ||
                          classSchedulePending ||
                          classSubjectSchedulePending
                        }
                      >
                        <TiDelete />
                      </Button>
                    ) : (
                      <Button
                        variant="light"
                        className="text-transparent hover:text-black data-[loading]:text-black w-full"
                        radius="none"
                        onClick={() => handleAddSchedule(day as TDayOfWeek, lession)}
                        isLoading={
                          addScheduleMutation.pending && mutatingCell.day === day && mutatingCell.lession === lession
                        }
                        isDisabled={
                          (addScheduleMutation.pending &&
                            (mutatingCell.day !== day || mutatingCell.lession !== lession)) ||
                          removeScheduleMutation.pending ||
                          teacherSchedulePending ||
                          classSchedulePending ||
                          classSubjectSchedulePending
                        }
                      >
                        <FaPlus />
                      </Button>
                    )
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
