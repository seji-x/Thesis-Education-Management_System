import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'

import { classSubjectEndpoint, userEndpoint } from '@/config/endpoints'
import { Role } from '@/helper/enums'
import { EDIT_SUBJECT_CLASS_SCHEMA } from '@/helper/schemas'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { IClassSubject, IUser } from '@/types'

interface Props {
  open: boolean
  classSubject: IClassSubject | null
  onClose: () => void
  onFinish: () => void
}

export default function EditSubject({ open, classSubject, onClose, onFinish }: Props) {
  const { response: teachersResponse, pending: teachersPending } = useGet<{ results: IUser[] }>({
    url: userEndpoint.BASE,
    config: {
      params: {
        role: Role.TEACHER,
      },
    },
  })

  const updateClassSubjectMutation = useMutation()

  const formik = useFormik({
    initialValues: {
      teacher_id: classSubject?.teacher_id?.id,
      year: classSubject?.year,
      semester: classSubject?.semester,
    },
    validationSchema: EDIT_SUBJECT_CLASS_SCHEMA,
    onSubmit: async (values) => {
      const { error } = await updateClassSubjectMutation.mutation({
        url: `${classSubjectEndpoint.BASE}/${classSubject?.id}`,
        method: 'patch',
        body: {
          ...values,
          year: Number(values.year),
        },
      })

      if (error) {
        toast.error(error?.data?.response?.detail || 'Can not update subject')
        return
      }
      toast.success('Subject updated')
      onFinish()
    },
  })

  useEffect(() => {
    formik.setValues({
      year: classSubject?.year,
      teacher_id: classSubject?.teacher_id?.id,
      semester: classSubject?.semester,
    })
  }, [classSubject])

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent>
        <ModalBody>
          <div className="pb-5">
            <p className="mt-5 text-xl font-bold">Edit class subject</p>
            <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
              <Select
                isLoading={teachersPending}
                value={formik.values.teacher_id}
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

              <Input
                value={(formik.values.year as unknown as string) || ''}
                label="Year"
                name="year"
                errorMessage={formik.errors.year}
                isInvalid={formik.touched.year && !!formik.errors.year}
                onChange={formik.handleChange}
              />

              <Button
                color="primary"
                size="lg"
                className="mt-5"
                isLoading={updateClassSubjectMutation.pending}
                type="submit"
              >
                Update
              </Button>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
