import { memo, useMemo } from 'react'
import { IUserSubjectScore } from '@/types'
import ScoreTable from '../ScoreTable'

interface Props {
  year: string | number
  data: {
    1: IUserSubjectScore[]
    2: IUserSubjectScore[]
  }
}

const getScoreLevel = (score: number) => {
  if (score >= 8) return 'Very Good'

  if (score >= 6.5) return 'Good'

  if (score >= 5) return 'Average'

  if (score >= 3) return 'Weak'

  return 'Poor'
}

function ScoreInYear({ year, data }: Props) {
  const averageScore = useMemo(() => {
    let average1, average2

    if (!data[1].length || data[1].some((subjectScore) => subjectScore.status === 'OPEN')) {
      average1 = null
    } else {
      average1 =
        data[1].reduce((currentTotal, scoreData) => (scoreData.average_score || 0) + currentTotal, 0) / data[1].length
    }

    if (!data[2].length || !data[2].some((subjectScore) => subjectScore.status === 'OPEN')) {
      average2 = null
    } else {
      average2 =
        data[2].reduce((currentTotal, scoreData) => (scoreData.average_score || 0) + currentTotal, 0) / data[2].length
    }

    const yearScore = typeof average1 === 'number' && typeof average2 === 'number' ? average1 + average2 : null

    return {
      average1,
      average2,
      year: yearScore,
    }
  }, [data])

  return (
    <div className="mt-10">
      <div className="p-2 rounded-lg border">
        <p className="text-lg font-semibold">{year} - 1</p>
        <ScoreTable subjectScores={data[1]} />

        <div>
          {typeof averageScore.average1 === 'number' && (
            <p>
              Average: {averageScore.average1} - {getScoreLevel(averageScore.average1)}
            </p>
          )}
        </div>
      </div>

      <div className="p-2 rounded-lg border mt-4">
        <p className="text-lg font-semibold">{year} - 2</p>
        <ScoreTable subjectScores={data[2]} />
        <div>
          {typeof averageScore.average2 === 'number' && (
            <p>
              Average: {averageScore.average2} - {getScoreLevel(averageScore.average2)}
            </p>
          )}
        </div>
      </div>
      {typeof averageScore.year === 'number' && (
        <p className="text-xl font-bold mt-1">
          Average {year}: {averageScore.year} - {getScoreLevel(averageScore.year)}
        </p>
      )}
    </div>
  )
}

export default memo(ScoreInYear)
