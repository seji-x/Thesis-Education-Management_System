import { ReactNode } from 'react'
import { useFormik } from 'formik'
import { Button } from '@nextui-org/button'
import { Input, Textarea } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import { SEND_NOTIFICATION_SCHEMA } from '@/helper/schemas'

interface Props {
  loading: boolean
  isOpen: boolean
  title: ReactNode
  onOpenChange: (isOpen: boolean) => void
  onSubmit: (data: { title: string; description: string }) => void
}
export default function SendNotification({ loading, isOpen, title, onOpenChange, onSubmit }: Props) {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: SEND_NOTIFICATION_SCHEMA,
    onSubmit: onSubmit,
  })

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h3 className="text-2xl">{title}</h3>
            </ModalHeader>
            <ModalBody>
              <div>
                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                  <Input
                    name="title"
                    label="Title"
                    variant="underlined"
                    errorMessage={formik.errors.title}
                    isInvalid={formik.touched.title && !!formik.errors.title}
                    onChange={formik.handleChange}
                  />

                  <Textarea
                    name="description"
                    label="Description"
                    variant="underlined"
                    errorMessage={formik.errors.description}
                    isInvalid={formik.touched.description && !!formik.errors.description}
                    onChange={formik.handleChange}
                  />
                  <div className="flex mt-5 gap-6">
                    <Button size="lg" className="w-full" type="button" onClick={onClose} disabled={loading}>
                      Cancel
                    </Button>
                    <Button size="lg" className="w-full" color="primary" type="submit" isLoading={loading}>
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
