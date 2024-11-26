'use client'

import { useEffect, useId, useState } from 'react'
import { useFormik } from 'formik'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'
import toast from 'react-hot-toast'
import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { DatePicker } from '@nextui-org/date-picker'
import { Input } from '@nextui-org/input'
import { Radio, RadioGroup } from '@nextui-org/radio'

import { Role } from '@/helper/enums'
import { CREATE_TEACHER_SCHEMA } from '@/helper/schemas'
import { useMutation } from '@/hooks/useMutation'
import { authEndpoint } from '@/config/endpoints'
import PageTitle from '@/components/common/PageTitle'

export default function CreateTeacher() {
  const [previewAvatar, setPreviewAvatar] = useState('')
  const inputAvatarId = useId()
  const createTeacherMutation = useMutation()

  const formik = useFormik({
    initialValues: {
      avatar: null,
      fullname: '',
      email: '',
      gender: 'MALE',
      address: '',
      phone_number: '',
      date_of_birth: null,
    },
    validationSchema: CREATE_TEACHER_SCHEMA,
    onSubmit: async (values) => {
      const form = new FormData()

      form.append('avatar', values.avatar as unknown as File)
      form.append('full_name', values.fullname)
      form.append('email', values.email)
      form.append('gender', values.gender)
      form.append('address', values.address)
      form.append('phone_number', values.phone_number)
      form.append('date_of_birth', (values.date_of_birth as unknown as DateValue).toString())
      form.append('role', Role.TEACHER)

      const { error } = await createTeacherMutation.mutation({
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
        toast.error(error?.data?.response?.detail || 'Can not create teacher')
        return
      }

      toast.success('Teacher created')
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
    <div>
      <PageTitle title="Create Teacher" />
      <form className="max-w-screen-sm mx-auto bg-white mt-4 p-8 rounded-xl shadow" onSubmit={formik.handleSubmit}>
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
            errorMessage={formik.errors.fullname}
            isInvalid={formik.touched.fullname && !!formik.errors.fullname}
            label="Full name"
            name="fullname"
            value={formik.values.fullname}
            variant="underlined"
            onChange={formik.handleChange}
          />

          <Input
            errorMessage={formik.touched.email && formik.errors.email}
            isInvalid={formik.touched.email && !!formik.errors.email}
            label="Email"
            name="email"
            value={formik.values.email}
            variant="underlined"
            onChange={formik.handleChange}
          />

          <Input
            errorMessage={formik.touched.address && formik.errors.address}
            isInvalid={formik.touched.address && !!formik.errors.address}
            label="Address"
            name="address"
            value={formik.values.address}
            variant="underlined"
            onChange={formik.handleChange}
          />

          <Input
            errorMessage={formik.touched.phone_number && formik.errors.phone_number}
            isInvalid={formik.touched.phone_number && !!formik.errors.phone_number}
            label="Phone number"
            name="phone_number"
            value={formik.values.phone_number}
            variant="underlined"
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
        </div>
        <Button
          className="mt-5 w-full"
          color="primary"
          isLoading={createTeacherMutation.pending}
          size="lg"
          type="submit"
        >
          Create
        </Button>
      </form>
    </div>
  )
}
