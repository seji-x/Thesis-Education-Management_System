'use client'

import { useFormik } from 'formik'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import toast from 'react-hot-toast'

import PageTitle from '@/components/common/PageTitle'
import { subjectEndpoint } from '@/config/endpoints'
import { CREATE_SUBJECT_SCHEMA } from '@/helper/schemas'
import { useMutation } from '@/hooks/useMutation'

export default function CreateSubject() {
  const createSubjectMutation = useMutation()
  const formik = useFormik({
    initialValues: { name: '', key: '', grade: '' },
    validationSchema: CREATE_SUBJECT_SCHEMA,
    onSubmit: async (values) => {
      const { error } = await createSubjectMutation.mutation({
        url: subjectEndpoint.BASE,
        method: 'post',
        body: values,
      })

      if (error) {
        toast.error(error?.data?.response?.detail || 'Can not create sibject')
        return
      }

      toast.success('Subject created')
      formik.resetForm()
    },
  })

  return (
    <div>
      <PageTitle title="Create subject" />
      <form className="max-w-screen-sm mx-auto bg-white mt-4 p-8 rounded-xl shadow" onSubmit={formik.handleSubmit}>
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
        <Button
          className="mt-5 w-full"
          color="primary"
          isLoading={createSubjectMutation.pending}
          size="lg"
          type="submit"
        >
          Create
        </Button>
      </form>
    </div>
  )
}
