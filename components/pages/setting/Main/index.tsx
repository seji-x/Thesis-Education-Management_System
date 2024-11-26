'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'

import { settingEndpoint } from '@/config/endpoints'
import { UPDATE_SETTING_RATE_SCORE_SCHEMA } from '@/helper/schemas'
import { DEFAULT_SCORE_SCHEMA } from '@/helper/datas'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { ISetting } from '@/types'
import PageTitle from '@/components/common/PageTitle'

export default function Setting() {
  const {
    response,
    pending: getSetingPedding,
    reFetch,
  } = useGet<{
    results: [
      {
        id: string
        data: ISetting
      }?,
    ]
  }>({
    url: settingEndpoint.BASE,
  })

  const updateSettingMutation = useMutation()

  const formik = useFormik({
    initialValues: DEFAULT_SCORE_SCHEMA,
    validationSchema: UPDATE_SETTING_RATE_SCORE_SCHEMA,
    async onSubmit(values) {
      const totalRate = Object.values(values).reduce((current, item) => current + Number(item), 0)
      if (totalRate !== 100) {
        toast.error(`Invalid rate, current total rate is ${totalRate}, total must be 100`)
        return
      }
      for (const key in values) {
        const _key = key as keyof typeof values
        values[_key] = Number(values[_key])
      }

      const url = response?.results[0] ? `${settingEndpoint.BASE}/${response?.results[0]?.id}` : settingEndpoint.BASE

      const { error } = await updateSettingMutation.mutation({
        url,
        method: response?.results[0] ? 'put' : 'post',
        body: {
          data: {
            ...response?.results[0]?.data,
            SCORE_SCHEMA: values,
          },
        },
      })
      if (error) {
        toast.error('Can not update')
        return
      }
      toast.success('Setting updated')
      reFetch()
    },
  })

  useEffect(() => {
    if (response?.results[0]?.data.SCORE_SCHEMA) {
      formik.setValues({
        ...response.results[0].data.SCORE_SCHEMA,
      })
    }
  }, [response])

  return (
    <div>
      <PageTitle title="Setting" />
      <div>
        <form onSubmit={formik.handleSubmit} className="max-w-screen-sm mx-auto bg-white mt-4 p-8 rounded-xl shadow">
          <p className="text-xl font-semibold pb-5">Setting rate score</p>
          <div className="grid gap-3 grid-cols-2">
            <Input
              isRequired
              errorMessage={formik.errors['15MIN']}
              isInvalid={formik.touched['15MIN'] && !!formik.errors['15MIN']}
              label="15MIN (%)"
              name="15MIN"
              value={formik.values['15MIN'] + ''}
              variant="underlined"
              isDisabled={getSetingPedding}
              onChange={formik.handleChange}
            />

            <Input
              isRequired
              errorMessage={formik.errors.LESSION}
              isInvalid={formik.touched.LESSION && !!formik.errors.LESSION}
              label="LESSION (%)"
              name="LESSION"
              value={formik.values.LESSION + ''}
              variant="underlined"
              isDisabled={getSetingPedding}
              onChange={formik.handleChange}
            />

            <Input
              isRequired
              errorMessage={formik.errors.MIDDLE}
              isInvalid={formik.touched.MIDDLE && !!formik.errors.MIDDLE}
              label="MIDDLE (%)"
              name="MIDDLE"
              value={formik.values.MIDDLE + ''}
              variant="underlined"
              isDisabled={getSetingPedding}
              onChange={formik.handleChange}
            />

            <Input
              isRequired
              errorMessage={formik.errors.FINAL}
              isInvalid={formik.touched.FINAL && !!formik.errors.FINAL}
              label="FINAL (%)"
              name="FINAL"
              value={formik.values.FINAL + ''}
              variant="underlined"
              isDisabled={getSetingPedding}
              onChange={formik.handleChange}
            />
          </div>
          <Button
            className="w-full mt-5"
            color="primary"
            size="lg"
            type="submit"
            isLoading={updateSettingMutation.pending}
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  )
}
