import { documentsEndpoint, subjectEndpoint } from '@/config/endpoints'
import { CREATE_DOCUMENT_SCHEMA } from '@/helper/schemas'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { IDocument, ISubject } from '@/types'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

interface Props {
  isOpen: boolean
  document: IDocument | null
  onClose: () => void
  onFinish: () => void
}

export default function EditDocment({ document, isOpen, onClose, onFinish }: Props) {
  const updateDocumentMutation = useMutation()

  const { response: subjectResponse } = useGet<{
    results: ISubject[]
  }>({
    url: subjectEndpoint.BASE,
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      subject: '',
      url: '',
    },
    validationSchema: CREATE_DOCUMENT_SCHEMA,
    async onSubmit(values) {
      const { error } = await updateDocumentMutation.mutation({
        method: 'patch',
        body: values,
        url: `${documentsEndpoint.BASE}/${document?.id}`,
      })

      if (error) {
        toast.error('Can not upadate document')
        return
      }
      toast.success('Document updated')
      onFinish()
    },
  })

  useEffect(() => {
    if (!document) return
    formik.setValues({
      title: document.title,
      description: document.description,
      subject: document.subject.id,
      url: document.url,
    })
  }, [document])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody>
          <p className="text-xl font-semibold">Update document</p>
          <form onSubmit={formik.handleSubmit}>
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

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="mt-5 w-full"
              isLoading={updateDocumentMutation.pending}
            >
              Update
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
