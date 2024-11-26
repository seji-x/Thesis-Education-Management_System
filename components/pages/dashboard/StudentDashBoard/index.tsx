'use client'

import { userSubjectScore } from '@/config/endpoints'
import { useGet } from '@/hooks/useGet'
import { RootState } from '@/redux'
import { axiosInstance } from '@/services/axiosInstance'
import { IUserSubjectScore } from '@/types'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useSelector } from 'react-redux'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Tooltip,
  BarController,
  Legend,
  Title,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default function StudentDashBoard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [subjectAverageScoreMapping, setSubjectAverageScoreMapping] = useState<
    { subjectScore: IUserSubjectScore; averageScore: number }[]
  >([])

  const { response: userSubjectScoreResponse } = useGet<{ results: IUserSubjectScore[] }>({
    url: userSubjectScore.BASE,
    config: {
      params: {
        student_id: user?.id,
      },
    },
  })

  useLayoutEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Tooltip,
      LineElement,
      ChartDataLabels,
      BarController,
      Legend,
      Title,
      Tooltip,
    )
  }, [])

  useEffect(() => {
    if (!userSubjectScoreResponse?.results) return
    const listComfirmedSubjectScore = userSubjectScoreResponse.results.filter(
      (studentScore) => studentScore.status === 'CONFIRM',
    )
    ;(async () => {
      try {
        const averageScoreResponse = await Promise.all(
          listComfirmedSubjectScore.map((confirmedSubjectScore) =>
            axiosInstance.get(userSubjectScore.AVERAGE_SCORE, {
              params: {
                subject_id: confirmedSubjectScore.subject.id,
              },
            }),
          ),
        )

        const averageScoreData: { average_score: number }[] = averageScoreResponse.map((res) => res.data)

        const subjectAverageScoreMapping = listComfirmedSubjectScore.map((confirmedSubjectScore, index) => ({
          subjectScore: confirmedSubjectScore,
          averageScore: averageScoreData[index].average_score,
        }))
        setSubjectAverageScoreMapping(subjectAverageScoreMapping)
      } catch (error) {}
    })()
  }, [userSubjectScoreResponse?.results])

  const groupScoreYear = useMemo(() => {
    const map = new Map<string, { subjectScore: IUserSubjectScore; averageScore: number }[]>()

    subjectAverageScoreMapping.forEach((mapping) => {
      map.set(mapping.subjectScore.class_subject.year + '', [
        ...(map.get(mapping.subjectScore.class_subject.year + '') || []),
        mapping,
      ])
    })

    return Array.from(map).sort(([keya], [keyb]) => Number(keyb) - Number(keya))
  }, [subjectAverageScoreMapping])

  return (
    <div className="py-5">
      {groupScoreYear.map(([year, data]) => (
        <div key={year} className="mt-10">
          <p className="text-xl font-bold">{year}</p>
          <Bar
            title="ababa"
            data={{
              labels: data.map((a) => a.subjectScore.subject.name),
              datasets: [
                {
                  backgroundColor: '#f00',
                  data: data.map((a) => a.averageScore.toFixed(2)),
                  label: 'Average score',
                  maxBarThickness: 40,
                },
                {
                  backgroundColor: '#0f0',
                  data: data.map((a) => a.subjectScore.average_score?.toFixed(2)),
                  label: 'Your score',
                  maxBarThickness: 40,
                },
              ],
            }}
          />
          <hr />
        </div>
      ))}
    </div>
  )
}
