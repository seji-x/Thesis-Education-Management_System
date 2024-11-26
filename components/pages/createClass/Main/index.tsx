'use client'

import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'

import { CREATE_CLASS_SCHEMA } from '@/helper/schemas'
import { Role } from '@/helper/enums'
import { useMutation } from '@/hooks/useMutation'
import { useGet } from '@/hooks/useGet'
import { classEndpoint, userEndpoint } from '@/config/endpoints'
import { IClass, IUser } from '@/types'
import PageTitle from '@/components/common/PageTitle'

export default function CreateClass() {
  const createClassMutation = useMutation<IClass>()
  const { response: teachers } = useGet<{
    results: IUser[]
  }>({
    url: userEndpoint.BASE,
    config: {
      params: {
        role: Role.TEACHER,
      },
    },
  })

  const formik = useFormik({
    initialValues: { name: '', key: '', year: '', teacher: '' },
    validationSchema: CREATE_CLASS_SCHEMA,
    onSubmit: async (values) => {
      const { response, error } = await createClassMutation.mutation({
        url: classEndpoint.BASE,
        method: 'post',
        body: values,
      })

      if (error) {
        toast.error(error?.data?.response?.detail || 'Can not create class')
        return
      }
      if (response) {
        toast.success(response.name + ' created')
        formik.resetForm()
      }
    },
  })

  return (
    <div className="pb-10">
      <PageTitle title="Create class" />
      <div>
        <div className="max-w-screen-sm mx-auto bg-white mt-4 p-8 rounded-xl shadow">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-3">
              <Input
                errorMessage={formik.errors.name}
                isInvalid={formik.touched.name && !!formik.errors.name}
                label="Name"
                name="name"
                variant="underlined"
                value={formik.values.name}
                onChange={formik.handleChange}
              />

              <Input
                errorMessage={formik.errors.key}
                isInvalid={formik.touched.key && !!formik.errors.key}
                label="Key"
                name="key"
                variant="underlined"
                value={formik.values.key}
                onChange={formik.handleChange}
              />

              <Input
                errorMessage={formik.errors.year}
                isInvalid={formik.touched.year && !!formik.errors.year}
                label="Year"
                name="year"
                type="number"
                variant="underlined"
                value={formik.values.year}
                onChange={formik.handleChange}
              />

              <Select
                label="Assignee teacher"
                variant="underlined"
                name="teacher"
                value={formik.values.teacher}
                onChange={formik.handleChange}
              >
                {(teachers?.results || []).map((teacher) => (
                  <SelectItem key={teacher.id}>{teacher.full_name}</SelectItem>
                ))}
              </Select>
            </div>

            <Button
              className="mt-5 w-full"
              color="primary"
              isLoading={createClassMutation.pending}
              size="lg"
              type="submit"
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
