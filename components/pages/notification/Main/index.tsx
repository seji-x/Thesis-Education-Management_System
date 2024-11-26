'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@nextui-org/pagination'

import { notificationEndpoint } from '@/config/endpoints'
import { updateSearchParams } from '@/helper/logics'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { INotification } from '@/types'
import ViewNotification from '@/components/common/ViewNotification'
import PageTitle from '@/components/common/PageTitle'
import NotificationItem from '../NotificationItem'

const RECORD_PER_PAGE = 10

export default function Notification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const [selectedNotification, setSelectedNotification] = useState<null | INotification>(null)

  const { response: notificationResponse, reFetch } = useGet<{ results: INotification[]; count: number }>(
    {
      url: notificationEndpoint.BASE,
      config: {
        params: {
          limit: RECORD_PER_PAGE,
          offset: (page - 1) * RECORD_PER_PAGE,
        },
      },
    },
    {
      deps: [page],
    },
  )

  const readNotificationMutation = useMutation()

  const handleClickNotification = async (notification: INotification) => {
    setSelectedNotification(notification)
    if (!notification.status) {
      try {
        const formdata = new FormData()
        formdata.append('status', true + '')
        const { error } = await readNotificationMutation.mutation({
          url: `${notificationEndpoint.BASE}/${notification.id}`,
          method: 'put',
          body: formdata,
          config: {
            headers: {
              'Content-Type': 'multipart-formdata',
            },
          },
        })

        if (!error) reFetch()
      } catch (error) {}
    }
  }

  return (
    <div>
      <PageTitle title="Notification" />
      <div className="mx-auto max-w-3xl p-4 rounded">
        {notificationResponse?.results.map((notification) => (
          <NotificationItem
            key={notification.id}
            title={notification.title}
            detail={notification.detail}
            sender={notification.sender}
            created_at={notification.created_at}
            status={notification.status}
            onClick={() => handleClickNotification(notification)}
          />
        ))}
      </div>
      <Pagination
        showControls
        showShadow
        className="mt-10 flex justify-center"
        page={page}
        total={Math.ceil((notificationResponse?.count || 0) / RECORD_PER_PAGE)}
        onChange={(page) => {
          router.replace(
            updateSearchParams({
              page,
            }),
          )
        }}
      />
      <ViewNotification
        isOpen={!!selectedNotification}
        notification={selectedNotification}
        onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}
      />
    </div>
  )
}
