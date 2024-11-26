'use client'

import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Button } from '@nextui-org/button'
import { Pagination } from '@nextui-org/pagination'
import { Spinner } from '@nextui-org/spinner'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Avatar } from '@nextui-org/avatar'
import { FaEye } from 'react-icons/fa'
import { MdDeleteOutline, MdModeEdit } from 'react-icons/md'

import { updateSearchParams } from '@/helper/logics'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { notificationEndpoint, userEndpoint } from '@/config/endpoints'
import { API_URL } from '@/config/constants'
import { Role } from '@/helper/enums'
import { IUser } from '@/types'
import { RootState } from '@/redux'
import SendNotification from '@/components/common/SendNotification'
import { IoMdClose } from 'react-icons/io'

export interface TeacherListRef {
  handleNotice: () => void
}

const RECORD_PER_PAGE = 10

const cols: { key: string; label: string }[] = [
  {
    key: 'no',
    label: 'No',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'code',
    label: 'Code',
  },

  {
    key: 'action',
    label: '',
  },
]

function TeacherList(_: any, ref: ForwardedRef<TeacherListRef>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search')
  const { user } = useSelector((state: RootState) => state.auth)
  const [selectedTeacher, setSelectedTeacher] = useState<IUser | null>(null)
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)

  const {
    response: teachers,
    pending,
    reFetch,
  } = useGet<{ count: number; results: IUser[] }>(
    {
      url: userEndpoint.BASE,
      config: {
        params: {
          limit: RECORD_PER_PAGE,
          offset: (page - 1) * RECORD_PER_PAGE,
          role: Role.TEACHER,
          search,
        },
      },
    },
    {
      deps: [page, search],
    },
  )

  const sendNotificationMutation = useMutation()
  const deleteTeacherMutation = useMutation()

  useImperativeHandle(ref, () => {
    return {
      handleNotice: () => {
        setIsOpen(true)
      },
    }
  })

  const handleSendNotification = async ({ title, description }: { title: string; description: string }) => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('detail', description)
    if (selectedTeachers.length) selectedTeachers.forEach((id) => formData.append('teacher_ids', id))
    else formData.append('all_teacher', 'true')
    const { error } = await sendNotificationMutation.mutation({
      url: notificationEndpoint.BASE,
      method: 'post',
      body: formData,
      config: {
        headers: {
          'Content-Type': 'multipart-formdata',
        },
      },
    })

    if (error) {
      toast.error(error?.data?.response?.detail || 'Can not send notification')
      return
    }

    toast.success('Notification sent')
    setIsOpen(false)
  }

  const handleDeleteTeachers = async () => {
    const { error } = await deleteTeacherMutation.mutation({
      url: userEndpoint.DELETE_MULTIPLE,
      method: 'delete',
      body: {
        user_ids: selectedTeachers,
      },
    })
    if (error) {
      toast.error('Can not delete student')
      return
    }

    toast.success('Student deleted')
    reFetch()
    setIsOpenDelete(false)
    setSelectedTeachers([])
  }

  return (
    <div className="mt-10">
      <Table
        isStriped
        aria-label="teacher-list"
        selectionMode="multiple"
        selectedKeys={selectedTeachers}
        onSelectionChange={(keys) => {
          if (keys === 'all') setSelectedTeachers((teachers?.results || []).map((teacher) => teacher.id))
          else setSelectedTeachers(Array.from(keys) as string[])
        }}
      >
        <TableHeader columns={cols}>
          {(col) => (
            <TableColumn key={col.key} align="center">
              {col.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody loadingContent={<Spinner />} loadingState="idle" isLoading={pending}>
          {(teachers?.results || []).map((teacher, index) => (
            <TableRow key={teacher.id}>
              <TableCell>{(page - 1) * RECORD_PER_PAGE + index + 1}</TableCell>
              <TableCell>{teacher.full_name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.code}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  <Button isIconOnly color="primary" variant="flat" onClick={() => setSelectedTeacher(teacher)}>
                    <FaEye className="text-lg" />
                  </Button>
                  {user?.role === Role.ADMIN && (
                    <Button
                      isIconOnly
                      color="warning"
                      variant="flat"
                      onClick={() => router.push(`/teacher/${teacher.id}/edit`)}
                    >
                      <MdModeEdit className="text-lg" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        showControls
        showShadow
        className="mt-10 flex justify-center"
        page={page}
        total={Math.ceil((teachers?.count || 0) / RECORD_PER_PAGE)}
        onChange={(page) => {
          router.replace(
            updateSearchParams({
              page,
            }),
          )
        }}
      />

      <Modal isOpen={!!selectedTeacher} onOpenChange={(isOpen) => !isOpen && setSelectedTeacher(null)}>
        <ModalContent>
          <ModalBody>
            <Avatar
              src={selectedTeacher?.avatar ? `${API_URL}${selectedTeacher.avatar}` : undefined}
              name={selectedTeacher?.full_name}
              className="mx-auto w-40 aspect-square h-40 text-4xl"
              showFallback
            />
            <div className="mt-4">
              <p className="text-4xl font-semibold text-center">{selectedTeacher?.full_name}</p>
              <p className="mt-2">Email: {selectedTeacher?.email}</p>
              <p className="mt-2">Teacher code: {selectedTeacher?.code}</p>
              <p className="mt-1">Phone: {selectedTeacher?.phone_number}</p>
              <p className="mt-1">Gender: {selectedTeacher?.gender}</p>
              <p className="mt-1">Address: {selectedTeacher?.address}</p>
              <p className="mt-1">DOB: {selectedTeacher?.date_of_birth}</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <SendNotification
        isOpen={isOpen}
        title={
          <>
            Send notification to {selectedTeachers.length ? 'Selected' : <span className="text-blue-500">ALL</span>}{' '}
            Teachers
          </>
        }
        loading={sendNotificationMutation.pending}
        onOpenChange={(isOpen) => !isOpen && !sendNotificationMutation.pending && setIsOpen(false)}
        onSubmit={handleSendNotification}
      />

      {!!selectedTeachers.length && (
        <div className="fixed z-50 left-1/2 -translate-x-1/2 bottom-20 bg-white shadow-md flex items-stretch rounded-lg px-1 overflow-hidden">
          <div className="p-2">{selectedTeachers.length} teachers selected</div>
          <Button color="danger" isIconOnly variant="flat" onClick={() => setIsOpenDelete(true)}>
            <MdDeleteOutline />
          </Button>
          <Button isIconOnly variant="light" onClick={() => setSelectedTeachers([])}>
            <IoMdClose />
          </Button>
        </div>
      )}
      <Modal isOpen={isOpenDelete}>
        <ModalContent>
          <ModalHeader>Delete Teachers</ModalHeader>
          <ModalBody>
            <p>Confirm delete these selected teachers?</p>
            <p>
              This action <strong>can not</strong> be recoverable
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsOpenDelete(false)} isDisabled={deleteTeacherMutation.pending} variant="light">
              Cancel
            </Button>
            <Button color="danger" isLoading={deleteTeacherMutation.pending} onClick={handleDeleteTeachers}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default forwardRef<TeacherListRef>(TeacherList)
