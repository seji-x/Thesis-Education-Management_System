'use client'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { userSubjectScore } from '@/config/endpoints'
import { useGet } from '@/hooks/useGet'
import { RootState } from '@/redux'
import { IUserSubjectScore } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import ScoreInYear from '../ScoreInYear'

export default function Score() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { response } = useGet<{
    results: IUserSubjectScore[]
  }>({
    url: userSubjectScore.BASE,
    config: {
      params: {
        student_id: user?.id,
      },
    },
  })

  const convertedScore = useMemo(() => {
    const mappingScore = new Map<
      string,
      {
        1: IUserSubjectScore[]
        2: IUserSubjectScore[]
      }
    >()
    if (!response?.results) return null

    response.results.forEach((subjectScore) => {
      if (mappingScore.has(`${subjectScore.class_subject.year}`)) {
        const dataInYear = mappingScore.get(`${subjectScore.class_subject.year}`)!
        if (subjectScore.class_subject.semester === 2) dataInYear[2].push(subjectScore)
        else dataInYear[1].push(subjectScore)

        mappingScore.set(`${subjectScore.class_subject.year}`, dataInYear)
      } else {
        const newDataInYear: {
          1: IUserSubjectScore[]
          2: IUserSubjectScore[]
        } = {
          1: [],
          2: [],
        }
        if (subjectScore.class_subject.semester === 2) newDataInYear[2].push(subjectScore)
        else newDataInYear[1].push(subjectScore)

        mappingScore.set(`${subjectScore.class_subject.year}`, newDataInYear)
      }
    })

    return Array.from(mappingScore.entries()).sort(([prevYear], [nextYear]) => {
      return Number(prevYear) - Number(nextYear)
    })
  }, [response?.results])

  return (
    <div>
      <PageTitle title="Score" />
      <div className="mt-10">
        {convertedScore?.map(([year, scoreInYear]) => <ScoreInYear key={year} year={year} data={scoreInYear} />)}
      </div>
    </div>
  )
}
