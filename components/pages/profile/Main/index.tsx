'use client'

import PageTitle from '@/components/common/PageTitle'
import { API_URL } from '@/config/constants'
import { authEndpoint } from '@/config/endpoints'
import { CHANGE_PASSWORD_SCHEMA } from '@/helper/schemas'
import { useMutation } from '@/hooks/useMutation'
import { RootState } from '@/redux'
import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useFormik } from 'formik'
import moment from 'moment'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [open, setOpen] = useState(false)

  const changePasswordMutation = useMutation()

  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
    validationSchema: CHANGE_PASSWORD_SCHEMA,
    async onSubmit(values) {
      const { error } = await changePasswordMutation.mutation({
        method: 'post',
        url: authEndpoint.CHANGE_PASSWORD,
        body: values,
      })

      if (error) {
        toast.error(error.response?.data?.[0] || 'Can not change password')

        return
      }

      toast.success('Password changed')
      formik.resetForm()
      setOpen(false)
    },
  })

  return (
    <div>
      <PageTitle title="Profile" />
      <div className="max-w-screen-sm mx-auto bg-white p-6 rounded-lg my-7">
        <Avatar
          src={`${API_URL}${user?.avatar}`}
          name={user?.full_name}
          showFallback
          className="mx-auto w-[300px] h-[300px] text-2xl aspect-square"
        />
        <p className="text-4xl uppercase font-semibold text-center py-4">{user?.full_name}</p>
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-bold">Code: </span>{' '}
            <span className="text-xl font-semibold">{user?.code}</span>
          </p>

          <p className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-bold">Email: </span>{' '}
            <span className="text-xl font-semibold">{user?.email}</span>
          </p>

          <p className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-bold">Phone: </span>{' '}
            <span className="text-xl font-semibold">{user?.phone_number}</span>
          </p>

          <p className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-bold">Gender: </span>{' '}
            <span className="text-xl font-semibold">{user?.gender}</span>
          </p>

          <p className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-bold">Address: </span>{' '}
            <span className="text-xl font-semibold">{user?.address}</span>
          </p>

          <p className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-bold">DOB: </span>{' '}
            <span className="text-xl font-semibold">{moment(user?.date_of_birth).format('DD/MM/yyyy')}</span>
          </p>
        </div>
        <Popover
          placement="top"
          showArrow
          style={{
            zIndex: 999,
          }}
          backdrop="opaque"
          isOpen={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger>
            <Button className="mt-10 w-full" color="primary" size="lg">
              Change password
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="w-[400px] p-2">
              <p className="text-center text-3xl font-semibold text-red-900">Change password</p>
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                <Input
                  name="old_password"
                  label="Old password"
                  variant="underlined"
                  isInvalid={formik.touched.old_password && !!formik.errors.old_password}
                  errorMessage={formik.errors.old_password}
                  onChange={formik.handleChange}
                />
                <Input
                  name="new_password"
                  label="New password"
                  variant="underlined"
                  isInvalid={formik.touched.new_password && !!formik.errors.new_password}
                  errorMessage={formik.errors.new_password}
                  onChange={formik.handleChange}
                />
                <Input
                  name="confirm_new_password"
                  label="Confirm password"
                  variant="underlined"
                  isInvalid={formik.touched.confirm_new_password && !!formik.errors.confirm_new_password}
                  errorMessage={formik.errors.confirm_new_password}
                  onChange={formik.handleChange}
                />

                <Button
                  className="mt-5 w-full"
                  color="primary"
                  size="lg"
                  type="submit"
                  isLoading={changePasswordMutation.pending}
                >
                  Confirm
                </Button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
