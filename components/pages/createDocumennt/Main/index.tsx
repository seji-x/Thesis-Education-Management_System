'use client'

import PageTitle from '@/components/common/PageTitle'
import { documentsEndpoint, subjectEndpoint } from '@/config/endpoints'
import { CREATE_DOCUMENT_SCHEMA } from '@/helper/schemas'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { ISubject } from '@/types'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'

export default function CreateDocument() {
  const { response: subjectResponse } = useGet<{
    results: ISubject[]
  }>({
    url: subjectEndpoint.BASE,
  })

  const createDocumentMutation = useMutation()

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      subject: '',
      url: '',
    },
    validationSchema: CREATE_DOCUMENT_SCHEMA,
    async onSubmit(values) {
      const { error } = await createDocumentMutation.mutation({
        method: 'post',
        body: values,
        url: documentsEndpoint.BASE,
      })

      if (error) {
        toast.error('Can not create document')
        return
      }
      toast.success('Document created')
      formik.resetForm()
    },
  })

  return (
    <div>
      <PageTitle title="Create document" />
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-lg p-5 my-5 mx-auto max-w-screen-md flex flex-col gap-3"
      >
        <Input
          name="title"
          label="Title"
          variant="underlined"
          value={formik.values.title}
          isInvalid={formik.touched.title && !!formik.errors.title}
          errorMessage={formik.errors.title}
          onChange={formik.handleChange}
        />
        <Input
          name="description"
          label="Description"
          variant="underlined"
          value={formik.values.description}
          isInvalid={formik.touched.description && !!formik.errors.description}
          errorMessage={formik.errors.description}
          onChange={formik.handleChange}
        />
        <Input
          name="url"
          label="Link"
          variant="underlined"
          value={formik.values.url}
          isInvalid={formik.touched.url && !!formik.errors.url}
          errorMessage={formik.errors.url}
          onChange={formik.handleChange}
        />

        <Select
          errorMessage={formik.errors.subject}
          value={formik.values.subject}
          isInvalid={formik.touched.subject && !!formik.errors.subject}
          name="subject"
          label="Subject"
          size="sm"
          variant="underlined"
          onChange={formik.handleChange}
        >
          {(subjectResponse?.results || []).map((subject) => (
            <SelectItem key={subject.id}>{subject.name}</SelectItem>
          ))}
        </Select>

        <Button type="submit" color="primary" size="lg" className="mt-5" isLoading={createDocumentMutation.pending}>
          Create
        </Button>
      </form>
    </div>
  )
}
