import { useFormik } from 'formik'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { FaCheck, FaRegCheckCircle } from 'react-icons/fa'

import { Spinner } from '@nextui-org/spinner'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { ImCancelCircle } from 'react-icons/im'
import { MdModeEdit } from 'react-icons/md'

import { exams } from '@/config/constants'
import { userSubjectScore } from '@/config/endpoints'
import { useMutation } from '@/hooks/useMutation'
import { useGet } from '@/hooks/useGet'
import { IUserSubjectScore, TExam, TScore } from '@/types'
import { RootState } from '@/redux'

const tableCols: {
  key: string
  label: string
  width?: string
}[] = [
  {
    key: 'no',
    label: 'No',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'code',
    label: 'Code',
  },
  {
    key: 'score',
    label: 'Score',
    width: '60%',
  },
  {
    key: 'action',
    label: 'Action',
  },
]

const initValues = exams.reduce((obj, exam) => {
  return {
    ...obj,
    [exam]: null,
  }
}, {}) as Record<TExam, null | number>

const REQUIRED_FIELD: TExam[] = ['MIDDLE', 'FINAL']

export default function Score() {
  const searchParams = useSearchParams()
  const classSubjectId = searchParams.get('cs_id')
  const { scoreSchema } = useSelector((state: RootState) => state.app)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [conclutionScore, setConclutionScore] = useState<number | null>(null)

  const { response, pending, reFetch } = useGet<{
    results: IUserSubjectScore[]
  }>(
    {
      url: userSubjectScore.BASE,
      config: {
        params: {
          class_subject_id: classSubjectId,
        },
      },
    },
    {
      disabled: !classSubjectId,
    },
  )
  const updateScoreMutation = useMutation()
  const confirmScoreMutation = useMutation()

  const formik = useFormik({
    initialValues: initValues,
    onSubmit: async (values) => {
      for (const key in values) {
        if (typeof values[key as TExam] !== 'number') {
          delete values[key as TExam]
        }
      }
      const { error } = await updateScoreMutation.mutation({
        url: `${userSubjectScore.BASE}/${editingId}`,
        method: 'put',
        body: {
          score: {
            ...values,
          },
          average_score: conclutionScore,
        },
      })
      if (error) {
        toast.error(error?.data?.response?.detail || 'Can not update score')
        return
      }
      handleCancelClick()
      reFetch()
    },
  })

  useEffect(() => {
    if (checkAllowConfirm(formik.values as TScore)) {
      const groupScore = new Map<string, number[]>()
      for (const key in formik.values) {
        const _key = key as keyof typeof formik.values
        switch (_key) {
          case '15MIN_1':
          case '15MIN_2':
          case '15MIN_3':
            groupScore.set('15MIN', [...(groupScore.get('15MIN') || []), formik.values[_key]!])
            break
          case 'LESSION_1':
          case 'LESSION_2':
            groupScore.set('LESSION', [...(groupScore.get('LESSION') || []), formik.values[_key]!])
            break
          case 'MIDDLE':
          case 'FINAL':
            groupScore.set(_key, [...(groupScore.get(_key) || []), formik.values[_key]!])
            break
        }
      }

      let conclutionScore = 0

      for (const key in scoreSchema) {
        const _key = key as keyof typeof scoreSchema
        const score = groupScore.get(_key)

        if (score) {
          conclutionScore +=
            ((score.reduce((current, item) => current + item, 0) / score.length) * scoreSchema[_key]) / 100
        }
      }

      setConclutionScore(Number(conclutionScore.toFixed(2)))
    } else if (conclutionScore !== null) setConclutionScore(null)
  }, [formik.values])

  const allowSubmit = useMemo(() => {
    for (const key in formik.values) {
      if (
        typeof formik.values[key as TExam] === 'number' &&
        ((formik.values[key as TExam] as number) < 0 || (formik.values[key as TExam] as number) > 10)
      )
        return false
    }

    return true
  }, [formik.values])

  const handleEdit = (scoreStudentId: string, score: IUserSubjectScore['score']) => {
    setEditingId(scoreStudentId)
    formik.setValues({
      ...initValues,
      ...score,
    })
  }

  const handleCancelClick = () => {
    setEditingId(null)
    formik.resetForm()
  }

  const handleConfirm = async (scoreStuddentId: string) => {
    const { error } = await confirmScoreMutation.mutation({
      url: `${userSubjectScore.BASE}/${scoreStuddentId}`,
      method: 'put',
      body: {
        status: 'CONFIRM',
      },
    })

    if (error) {
      toast.error('Confirm score failed')
      return
    }

    toast.success('Score confirmed')
    reFetch()
  }

  const checkAllowConfirm = (score: TScore) =>
    REQUIRED_FIELD.every((field) => field in score && typeof score[field] === 'number')

  const getConclutionScore = (scores: TScore) => {
    if (checkAllowConfirm(scores)) {
      const groupScore = new Map<string, number[]>()
      for (const key in scores) {
        const _key = key as keyof TScore
        switch (_key) {
          case '15MIN_1':
          case '15MIN_2':
          case '15MIN_3':
            groupScore.set('15MIN', [...(groupScore.get('15MIN') || []), scores[_key]!])
            break
          case 'LESSION_1':
          case 'LESSION_2':
            groupScore.set('LESSION', [...(groupScore.get('LESSION') || []), scores[_key]!])
            break
          case 'MIDDLE':
          case 'FINAL':
            groupScore.set(_key, [...(groupScore.get(_key) || []), scores[_key]!])
            break
        }
      }

      let conclutionScore = 0

      for (const key in scoreSchema) {
        const _key = key as keyof typeof scoreSchema
        const score = groupScore.get(_key)

        if (score) {
          conclutionScore +=
            ((score.reduce((current, item) => current + item, 0) / score.length) * scoreSchema[_key]) / 100
        }
      }

      return Number(conclutionScore.toFixed(2))
    }
    return null
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Table>
          <TableHeader columns={tableCols}>
            {(col) => (
              <TableColumn
                key={col.key}
                style={{
                  width: col.width,
                }}
                align="center"
              >
                {col.key === 'score' ? (
                  <div>
                    <p>Score</p>
                    <div className="grid grid-cols-8">
                      {exams.map((exam) => (
                        <div key={exam} className="border-l py-1">
                          {exam}
                        </div>
                      ))}
                      <div className="uppercase border-l py-1">conclusion</div>
                    </div>
                  </div>
                ) : (
                  col.label
                )}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody isLoading={pending} loadingContent={<Spinner />}>
            {(response?.results || []).map((scoreStudent, index) => (
              <TableRow key={scoreStudent.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{scoreStudent.student_id.full_name}</TableCell>
                <TableCell>{scoreStudent.student_id.code}</TableCell>
                <TableCell>
                  <div className="grid grid-cols-8">
                    {editingId === scoreStudent.id
                      ? exams.map((exam) => (
                          <Input
                            key={exam}
                            name={exam}
                            value={formik.values[exam] + ''}
                            onChange={formik.handleChange}
                            placeholder={exam}
                            variant="flat"
                            type="number"
                            radius="none"
                            min={0}
                            max={10}
                            className="placeholder:text-xs placeholder:text-red-500"
                          />
                        ))
                      : exams.map((exam) => (
                          <div key={exam} className="border-x h-8 flex items-center justify-center">
                            {scoreStudent.score[exam]}
                          </div>
                        ))}
                    <div className="border-x h-8 flex items-center justify-center">
                      {(editingId === scoreStudent.id ? conclutionScore : null) ||
                        scoreStudent.average_score ||
                        getConclutionScore(scoreStudent.score)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {editingId === scoreStudent.id ? (
                    <>
                      <Button
                        isIconOnly
                        type="submit"
                        color="success"
                        variant="flat"
                        className="text-lg disabled:cursor-not-allowed"
                        key="submit-btn"
                        disabled={!allowSubmit}
                        isDisabled={updateScoreMutation.pending}
                      >
                        <FaRegCheckCircle />
                      </Button>
                      <Button
                        isIconOnly
                        type="button"
                        color="secondary"
                        variant="flat"
                        className="text-lg ml-1"
                        key="cancel-edit-btn"
                        disabled={updateScoreMutation.pending}
                        onClick={handleCancelClick}
                      >
                        <ImCancelCircle />
                      </Button>
                    </>
                  ) : scoreStudent.class_subject.status === 'ACTIVE' ? (
                    scoreStudent.status === 'OPEN' ? (
                      <>
                        {checkAllowConfirm(scoreStudent.score) && (
                          <>
                            <Tooltip content="Confirm" color="warning" showArrow>
                              <Button
                                key="confirm-btn"
                                isIconOnly
                                type="button"
                                color="success"
                                variant="flat"
                                className="text-lg"
                                isDisabled={confirmScoreMutation.pending}
                                onClick={() => handleConfirm(scoreStudent.id)}
                              >
                                <FaCheck />
                              </Button>
                            </Tooltip>
                          </>
                        )}
                        <Button
                          key="edit-btn"
                          isIconOnly
                          type="button"
                          color="primary"
                          variant="flat"
                          className="text-lg ml-1"
                          isDisabled={confirmScoreMutation.pending}
                          onClick={() => handleEdit(scoreStudent.id, scoreStudent.score)}
                        >
                          <MdModeEdit />
                        </Button>
                      </>
                    ) : (
                      'CONFIRMED'
                    )
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  )
}
