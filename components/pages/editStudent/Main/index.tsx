'use client'

import { useEffect, useId, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'

import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { DatePicker } from '@nextui-org/date-picker'
import { Input } from '@nextui-org/input'
import { Radio, RadioGroup } from '@nextui-org/radio'

import { userEndpoint } from '@/config/endpoints'
import { formatString, getDateValue } from '@/helper/logics'
import { UPDATE_STTUDENT_SCHEMA } from '@/helper/schemas'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { IUser } from '@/types'
import PageTitle from '@/components/common/PageTitle'

export default function EditStudent() {
  const { id } = useParams()
  const router = useRouter()
  const inputAvatarId = useId()
  const [previewAvatar, setPreviewAvatar] = useState('')
  const updateStudentMutation = useMutation()
  const updateAvatarMutation = useMutation()

  const { response: student } = useGet<IUser>({
    url: `${userEndpoint.BASE}/${id}`,
  })

  const formik = useFormik<{
    avatar: File | null
    full_name: string
    email: string
    gender: 'MALE' | 'FEMALE'
    date_of_birth: null | DateValue
    address: string
    phone_number: string
  }>({
    initialValues: {
      avatar: null,
      full_name: '',
      email: '',
      gender: 'MALE',
      date_of_birth: null,
      address: '',
      phone_number: '',
    },
    validationSchema: UPDATE_STTUDENT_SCHEMA,
    onSubmit: async (values) => {
      if (values.avatar) {
        const form = new FormData()
        form.append('avatar', values.avatar)
        await updateAvatarMutation.mutation({
          url: formatString(userEndpoint.UPDATE_AVATAR, {
            id: id as string,
          }),
          method: 'put',
          body: form,
        })
      }
      const { error } = await updateStudentMutation.mutation({
        url: `${userEndpoint.BASE}/${id}`,
        method: 'put',
        body: {
          ...values,
          date_of_birth: values.date_of_birth?.toString(),
        },
      })

      if (error) {
        toast.error(error?.data?.respoonse?.detail || 'Can not update student')
        return
      }
      toast.success('Student updated')
      router.push('/student')
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

  useEffect(() => {
    if (student) {
      formik.setValues({
        address: student.address || '',
        date_of_birth: getDateValue(student.date_of_birth),
        email: student.email,
        full_name: student.full_name,
        gender: student.gender,
        phone_number: student.phone_number || '',
        avatar: null,
      })
    }
  }, [student])

  return (
    <div>
      <PageTitle title="Edit student" />
      <div className="max-w-screen-sm mx-auto bg-white mt-4 p-8 rounded-xl shadow">
        <form onSubmit={formik.handleSubmit}>
          <label className="block w-40 aspect-square mx-auto rounded-full cursor-pointer" id={inputAvatarId}>
            <Avatar
              isBordered
              className="w-full h-full rounded-full"
              src={previewAvatar || student?.avatar || undefined}
              showFallback
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
              isDisabled
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
          </div>
          <Button
            className="mt-5 w-full"
            color="primary"
            isLoading={updateStudentMutation.pending || updateAvatarMutation.pending}
            size="lg"
            type="submit"
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  )
}
