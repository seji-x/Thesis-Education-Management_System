'use client'

import { useEffect, useId, useState } from 'react'
import { useFormik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'

import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { DatePicker } from '@nextui-org/date-picker'
import { Input } from '@nextui-org/input'
import { Radio, RadioGroup } from '@nextui-org/radio'

import { userEndpoint } from '@/config/endpoints'
import { formatString, getDateValue } from '@/helper/logics'
import { UPDATE_TEACHER_SCHEMA } from '@/helper/schemas'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { IUser, TGender } from '@/types'
import PageTitle from '@/components/common/PageTitle'

export default function EditTeacher() {
  const { id } = useParams()
  const router = useRouter()
  const inputAvatarId = useId()
  const [previewAvatar, setPreviewAvatar] = useState('')
  const updateTeacherMutation = useMutation()
  const updateAvatarMutation = useMutation()

  const { response: teacher } = useGet<IUser>({
    url: `${userEndpoint.BASE}/${id}`,
  })

  const formik = useFormik<{
    avatar: File | null
    fullname: string
    email: string
    gender: TGender
    address: string
    phone_number: string
    date_of_birth: null | DateValue
  }>({
    initialValues: {
      avatar: null,
      fullname: '',
      email: '',
      gender: 'MALE',
      address: '',
      phone_number: '',
      date_of_birth: null,
    },
    validationSchema: UPDATE_TEACHER_SCHEMA,
    onSubmit: async (values) => {
      if (values.avatar) {
        const formData = new FormData()
        formData.append('avatar', values.avatar)
        await updateAvatarMutation.mutation({
          url: formatString(userEndpoint.UPDATE_AVATAR, {
            id: id as string,
          }),
          method: 'put',
          body: formData,
        })
      }
      const { error } = await updateTeacherMutation.mutation({
        url: `${userEndpoint.BASE}/${id}`,
        method: 'put',
        body: {
          ...values,
          date_of_birth: values.date_of_birth?.toString(),
        },
      })

      if (error) {
        toast.error(error?.data?.respoonse?.detail || 'Can not update teacher')
        return
      }
      toast.success('teacher updated')
      router.push('/teacher')
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
    if (teacher) {
      formik.setValues({
        avatar: null,
        address: teacher.address || '',
        date_of_birth: getDateValue(teacher.date_of_birth),
        email: teacher.email,
        fullname: teacher.full_name,
        gender: teacher.gender,
        phone_number: teacher.phone_number || '',
      })
    }
  }, [teacher])

  return (
    <div>
      <PageTitle title="Edit teacher" />

      <form className="max-w-screen-sm mx-auto bg-white mt-4 p-8 rounded-xl shadow" onSubmit={formik.handleSubmit}>
        <label className="block w-40 aspect-square mx-auto rounded-full cursor-pointer" htmlFor={inputAvatarId}>
          <Avatar
            isBordered
            className="w-full h-full rounded-full"
            src={previewAvatar || teacher?.avatar || undefined}
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
          isLoading={updateTeacherMutation.pending || updateAvatarMutation.pending}
          size="lg"
          type="submit"
        >
          Update
        </Button>
      </form>
    </div>
  )
}
