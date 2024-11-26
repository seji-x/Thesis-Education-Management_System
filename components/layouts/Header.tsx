'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown'
import { GoSidebarCollapse } from 'react-icons/go'
import { User } from '@nextui-org/user'
import { RootState } from '@/redux'
import { actionLogout } from '@/redux/slices/auth'
import { Role } from '@/helper/enums'
import { IoNotificationsOutline } from 'react-icons/io5'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Badge } from '@nextui-org/badge'
import { useGet } from '@/hooks/useGet'
import { notificationEndpoint } from '@/config/endpoints'
import { INotification } from '@/types'
import { Card, CardBody } from '@nextui-org/card'
import { Avatar } from '@nextui-org/avatar'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'
import { Tab, Tabs } from '@nextui-org/tabs'
import { Spinner } from '@nextui-org/spinner'
import { useMutation } from '@/hooks/useMutation'
import ViewNotification from '../common/ViewNotification'
import { API_URL } from '@/config/constants'

interface Props {
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
}

export default function Header({ collapsed, setCollapsed }: Props) {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const [option, setOption] = useState<'ALL' | 'UNREAD'>('ALL')
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null)

  const {
    response: notificationResponse,
    pending,
    reFetch,
  } = useGet<{
    results: INotification[]
    unread: number
  }>(
    {
      url: notificationEndpoint.BASE,
      config: {
        params: {
          limit: 20,
          offset: 0,
          status: option === 'UNREAD' ? false : undefined,
        },
      },
    },
    {
      deps: [option],
    },
  )

  const readNotificationMutation = useMutation()

  const handleClickNotification = async (notification: INotification) => {
    setSelectedNotification(notification)
    if (!notification.status) {
      const formData = new FormData()
      formData.append('status', 'true')
      const { error } = await readNotificationMutation.mutation({
        url: `${notificationEndpoint.BASE}/${notification.id}`,
        method: 'put',
        body: formData,
        config: {
          headers: {
            'Content-Type': 'multipart-formdata',
          },
        },
      })

      if (!error) reFetch()
    }
  }

  return (
    <header className="h-20 shrink-0 w-full bg-white flex items-center px-6 shadow-sm justify-between">
      <Button
        isIconOnly
        className={`${collapsed ? '' : 'rotate-180'} duration-200`}
        color="primary"
        size="sm"
        variant="light"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <GoSidebarCollapse className="text-base text-black" />
      </Button>
      <div className="flex items-center gap-3">
        {[Role.STUDENT, Role.TEACHER].includes(user?.role as Role) && (
          <Popover
            placement="bottom-end"
            style={{
              zIndex: 40,
            }}
          >
            <PopoverTrigger>
              <Button isIconOnly size="md" variant="light" className="text-xl">
                <Badge
                  content={notificationResponse?.unread}
                  isInvisible={!notificationResponse?.unread}
                  color="danger"
                  size="sm"
                  className="font-semibold"
                >
                  <IoNotificationsOutline />
                </Badge>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[320px] bg-gray-100">
              <div className="py-2 border-b w-full flex justify-between items-center">
                <p className="text-lg font-semibold text-purple-900">Notification</p>
                <Tabs
                  size="sm"
                  radius="full"
                  variant="underlined"
                  selectedKey={option}
                  onSelectionChange={(k) => setOption(k as 'ALL' | 'UNREAD')}
                >
                  <Tab key="ALL" title="All" />
                  <Tab key="UNREAD" title="Unread" />
                </Tabs>
              </div>
              <div className="w-full relative">
                {pending && (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px] z-10">
                    <Spinner />
                  </div>
                )}
                {notificationResponse?.results.map((notification) => (
                  <Card
                    key={notification.id}
                    isPressable
                    className={twMerge('w-full shadow-none', notification.status ? 'bg-gray-100' : 'bg-white')}
                    onClick={() => handleClickNotification(notification)}
                  >
                    <CardBody>
                      <div className="flex gap-2">
                        <Avatar
                          src={notification.sender.avatar || undefined}
                          showFallback
                          name={notification.sender.full_name}
                          className="shrink-0"
                        />
                        <div className="grow">
                          <h3 className="line-clamp-1">{notification.title}</h3>
                          <p className="text-[10px] text-right text-gray-500 font-semibold">
                            {moment(notification.created_at).format('HH:mm DD/MM/yyyy')}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Dropdown>
          <DropdownTrigger>
            <User
              avatarProps={{
                name: user?.full_name,
                color: 'success',
                src: `${API_URL}${user?.avatar}`,
                showFallback: true,
              }}
              className="border rounded-full p-0.5 pr-4 cursor-pointer shadow"
              description={user?.role}
              name={user?.full_name}
            />
          </DropdownTrigger>
          <DropdownMenu>
            {[Role.STUDENT, Role.TEACHER].includes(user?.role as Role) &&
              ((
                <DropdownSection showDivider>
                  <DropdownItem key={'profile'} onClick={() => router.push('/profile')}>
                    Profile
                  </DropdownItem>
                </DropdownSection>
              ) as any)}

            <DropdownItem
              key={'logout'}
              color="warning"
              onClick={() => {
                dispatch(actionLogout())
                router.replace('/auth/login')
              }}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ViewNotification
        isOpen={!!selectedNotification}
        onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </header>
  )
}
