import { useEffect } from 'react'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import { subjectEndpoint } from '@/config/endpoints'
import { CREATE_SUBJECT_SCHEMA } from '@/helper/schemas'
import { useMutation } from '@/hooks/useMutation'
import { ISubject } from '@/types'

interface Props {
  isOpen: boolean
  subject: ISubject | null
  onClose: () => void
  onFinish: () => void
}

export default function EditSubject({ isOpen, subject, onClose, onFinish }: Props) {
  const updateSubjectMutation = useMutation()

  const formik = useFormik({
    initialValues: {
      name: subject?.name,
      key: subject?.key,
      grade: subject?.grade,
    },
    async onSubmit(values) {
      const { error } = await updateSubjectMutation.mutation({
        url: `${subjectEndpoint.BASE}/${subject?.id}`,
        method: 'put',
        body: values,
      })

      if (error) {
        toast.error('Can not update')
        return
      }
      toast.success('Subject updated')
      onFinish()
    },

    validationSchema: CREATE_SUBJECT_SCHEMA,
  })

  useEffect(() => {
    if (subject)
      formik.setValues({
        name: subject?.name,
        key: subject?.key,
        grade: subject?.grade,
      })
  }, [subject])

  return (
    <Modal onClose={() => !updateSubjectMutation.pending && onClose()} isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>Update subject</ModalHeader>
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-3">
              <Input
                errorMessage={formik.errors.name}
                isInvalid={formik.touched.name && !!formik.errors.name}
                label="Name"
                name="name"
                value={formik.values.name}
                variant="underlined"
                onChange={formik.handleChange}
              />
              <Input
                errorMessage={formik.errors.key}
                isInvalid={formik.touched.key && !!formik.errors.key}
                label="Key"
                name="key"
                value={formik.values.key}
                variant="underlined"
                onChange={formik.handleChange}
              />
              <Input
                errorMessage={formik.errors.grade}
                isInvalid={formik.touched.grade && !!formik.errors.grade}
                label="grade"
                name="grade"
                value={formik.values.grade}
                type="number"
                variant="underlined"
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex gap-4">
              <Button
                className="mt-5 w-full"
                size="lg"
                type="button"
                isDisabled={updateSubjectMutation.pending}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="mt-5 w-full"
                color="primary"
                isLoading={updateSubjectMutation.pending}
                size="lg"
                type="submit"
              >
                Update
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
