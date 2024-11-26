'use client'

import { useEffect, useId, useState } from 'react'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { DatePicker } from '@nextui-org/date-picker'
import { Input } from '@nextui-org/input'
import { Radio, RadioGroup } from '@nextui-org/radio'
import { Select, SelectItem } from '@nextui-org/select'

import { useMutation } from '@/hooks/useMutation'
import { useGet } from '@/hooks/useGet'
import { CREATE_STUDENT_SCHEMA } from '@/helper/schemas'
import { Role } from '@/helper/enums'
import { authEndpoint, classEndpoint } from '@/config/endpoints'
import { IClass } from '@/types'
import PageTitle from '@/components/common/PageTitle'

export default function CreateStudent() {
  const inputAvatarId = useId()
  const [previewAvatar, setPreviewAvatar] = useState('')
  const createStudentMutation = useMutation()
  const { response, pending } = useGet<{ results: IClass[] }>({
    url: classEndpoint.BASE,
  })

  const formik = useFormik({
    initialValues: {
      avatar: null,
      full_name: '',
      email: '',
      class_id: '',
      gender: 'MALE',
      date_of_birth: null,
      address: '',
      phone_number: '',
    },
    validationSchema: CREATE_STUDENT_SCHEMA,
    onSubmit: async (values) => {
      const form = new FormData()

      form.append('avatar', values.avatar as any)
      form.append('full_name', values.full_name)
      form.append('email', values.email)
      form.append('class_id', values.class_id)
      form.append('gender', values.gender)
      form.append('date_of_birth', (values.date_of_birth as unknown as DateValue).toString())
      form.append('address', values.address)
      form.append('phone_number', values.phone_number)
      form.append('role', Role.STUDENT)

      const { error } = await createStudentMutation.mutation({
        url: authEndpoint.REGISTER,
        method: 'post',
        body: form,
        config: {
          headers: {
            'Content-Type': 'multipart-formdata',
          },
        },
      })
      if (error) {
        toast.error(error?.data?.response?.detail || 'Can not create student')
        return
      }

      toast.success('Student created')
      formik.resetForm()
    },
  })

  useEffect(() => {
    if (formik.values.avatar) {
      setPreviewAvatar(URL.createObjectURL(formik.values.avatar))
    }

    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar)
    }
  }, [formik.values.avatar])

  return (
    <div className="pb-10">
      <PageTitle title="Create student" />
      <div className="max-w-screen-sm mx-auto bg-white mt-4 p-8 rounded-xl shadow">
        <form onSubmit={formik.handleSubmit}>
          <label className="block w-40 aspect-square mx-auto rounded-full cursor-pointer" id={inputAvatarId}>
            <Avatar
              isBordered
              className="w-full h-full rounded-full"
              color={formik.touched.avatar && formik.errors.avatar ? 'danger' : undefined}
              src={previewAvatar}
            />
            <input
              hidden
              accept=".jpg, .png"
              id={inputAvatarId}
              name="avatar"
              type="file"
              onChange={(e) => {
                formik.setFieldValue('avatar', e.target.files?.item(0))
              }}
            />
          </label>
          <br />
          <div className="flex flex-col gap-3">
            <Input
              isRequired
              errorMessage={formik.errors.full_name}
              isInvalid={formik.touched.full_name && !!formik.errors.full_name}
              label="Full name"
              name="full_name"
              value={formik.values.full_name}
              variant="underlined"
              onChange={formik.handleChange}
            />

            <Input
              errorMessage={formik.touched.email && formik.errors.email}
              isInvalid={formik.touched.email && !!formik.errors.email}
              label="Email"
              name="email"
              variant="underlined"
              value={formik.values.email}
              onChange={formik.handleChange}
            />

            <Input
              errorMessage={formik.touched.address && formik.errors.address}
              isInvalid={formik.touched.address && !!formik.errors.address}
              label="Address"
              name="address"
              variant="underlined"
              value={formik.values.address}
              onChange={formik.handleChange}
            />

            <Input
              errorMessage={formik.touched.phone_number && formik.errors.phone_number}
              isInvalid={formik.touched.phone_number && !!formik.errors.phone_number}
              label="Phone number"
              name="phone_number"
              variant="underlined"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
            />

            <RadioGroup
              label="Gender"
              name="gender"
              orientation="horizontal"
              value={formik.values.gender}
              onChange={formik.handleChange}
            >
              <Radio value="MALE">Male</Radio>
              <Radio value="FEMALE">Female</Radio>
            </RadioGroup>

            <DatePicker
              errorMessage={formik.errors.date_of_birth}
              isInvalid={formik.touched.date_of_birth && !!formik.errors.date_of_birth}
              label="Date of borth"
              maxValue={today(getLocalTimeZone())}
              name="date_of_birth"
              value={formik.values.date_of_birth}
              variant="underlined"
              onChange={(date) => formik.setFieldValue('date_of_birth', date)}
            />

            <Select
              errorMessage={formik.errors.class_id}
              isInvalid={formik.touched.class_id && !!formik.errors.class_id}
              label="Class"
              name="class_id"
              variant="underlined"
              isLoading={pending}
              value={formik.values.class_id}
              onChange={formik.handleChange}
            >
              {(response?.results || []).map((_class) => (
                <SelectItem key={_class.id}>{_class.name}</SelectItem>
              ))}
            </Select>
          </div>
          <Button
            className="mt-5 w-full"
            color="primary"
            isLoading={createStudentMutation.pending}
            size="lg"
            type="submit"
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  )
}
