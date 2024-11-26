import { useFormik } from 'formik'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

import { Select, SelectItem } from '@nextui-org/select'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'

import { classSubjectEndpoint, subjectEndpoint, userEndpoint } from '@/config/endpoints'
import { Role } from '@/helper/enums'
import { ADD_SUBJECT_SCHEMA } from '@/helper/schemas'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { ISubject, IUser, TClassSubjectStatus } from '@/types'

interface Props {
  classSubjects: {
    id: string
    subject: ISubject
    teacher_id?: IUser
    status: TClassSubjectStatus
  }[]
  onFinish: () => void
}

export default function AddSubject({ classSubjects, onFinish }: Props) {
  const { id } = useParams()
  const { response: teachersResponse, pending: teachersPending } = useGet<{ results: IUser[] }>({
    url: userEndpoint.BASE,
    config: {
      params: {
        role: Role.TEACHER,
      },
    },
  })

  const { response: subjectsResponse, pending: subjectsPending } = useGet<{ results: ISubject[] }>({
    url: subjectEndpoint.BASE,
  })

  const addSubjectMutation = useMutation()

  const formik = useFormik({
    initialValues: {
      subject: '',
      teacher_id: '',
      year: '',
      semester: '',
    },
    validationSchema: ADD_SUBJECT_SCHEMA,
    onSubmit: async (values) => {
      const { error } = await addSubjectMutation.mutation({
        url: classSubjectEndpoint.BASE,
        method: 'post',
        body: {
          ...values,
          year: Number(values.year),
          class_instance: id,
        },
      })

      if (error) {
        toast.error(error?.data?.response?.detail || 'Can not add subject')
        return
      }
      toast.success('Subject added')
      onFinish()
    },
  })

  return (
    <div className="pb-5">
      <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <Select
          isLoading={teachersPending}
          label="Teacher"
          name="teacher_id"
          errorMessage={formik.errors.teacher_id}
          isInvalid={formik.touched.teacher_id && !!formik.errors.teacher_id}
          onChange={formik.handleChange}
        >
          {(teachersResponse?.results || []).map((teacher) => (
            <SelectItem key={teacher.id}>{teacher.full_name}</SelectItem>
          ))}
        </Select>

        <Input
          label="Year"
          name="year"
          errorMessage={formik.errors.year}
          isInvalid={formik.touched.year && !!formik.errors.year}
          onChange={formik.handleChange}
        />

        <Select
          label="Semester"
          name="semester"
          value={formik.values.semester}
          errorMessage={formik.errors.semester}
          isInvalid={formik.touched.semester && !!formik.errors.semester}
          onChange={formik.handleChange}
        >
          {[1, 2].map((semester) => (
            <SelectItem key={semester}>{semester + ''}</SelectItem>
          ))}
        </Select>

        <Select
          isLoading={subjectsPending}
          label="Subject"
          name="subject"
          errorMessage={formik.errors.subject}
          isInvalid={formik.touched.subject && !!formik.errors.subject}
          onChange={formik.handleChange}
        >
          {(subjectsResponse?.results || [])
            .filter((subject) => !classSubjects.some((classSubject) => classSubject.subject.id === subject.id))
            .map((subject) => (
              <SelectItem key={subject.id}>{subject.name}</SelectItem>
            ))}
        </Select>
        <Button color="primary" size="lg" className="mt-5" isLoading={addSubjectMutation.pending} type="submit">
          Add
        </Button>
      </form>
    </div>
  )
}
