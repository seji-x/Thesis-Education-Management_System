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
import { IoMdClose } from 'react-icons/io'

import { updateSearchParams } from '@/helper/logics'
import { Role } from '@/helper/enums'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { notificationEndpoint, userClassEndpoint, userEndpoint } from '@/config/endpoints'
import { API_URL } from '@/config/constants'
import { IClass, IUser } from '@/types'
import { RootState } from '@/redux'
import SendNotification from '@/components/common/SendNotification'

export interface StudentListRef {
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
    key: 'class',
    label: 'Class',
  },
  {
    key: 'action',
    label: '',
  },
]

function StudentList(_: unknown, ref: ForwardedRef<StudentListRef>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search')
  const classId = searchParams.get('classId')
  const { user } = useSelector((state: RootState) => state.auth)
  const [selectedStudent, setSelectedStudent] = useState<{ user: IUser; class_instance: IClass } | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)

  const { response, pending, reFetch } = useGet<{ count: number; results: { user: IUser; class_instance: IClass }[] }>(
    {
      url: userClassEndpoint.BASE,
      config: {
        params: {
          search,
          class_id: classId,
          limit: RECORD_PER_PAGE,
          offset: (page - 1) * RECORD_PER_PAGE,
        },
      },
    },
    {
      deps: [search, classId, page],
    },
  )

  const sendNotificationMutation = useMutation()
  const deleteStudentMutation = useMutation()

  useImperativeHandle(ref, () => ({
    handleNotice: () => setIsOpen(true),
  }))

  const handleSendNotification = async ({ title, description }: { title: string; description: string }) => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('detail', description)
    if (selectedStudents.length) selectedStudents.forEach((id) => formData.append('student_ids', id))
    else formData.append('all_students', 'true')
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

  const handleDeleteStudents = async () => {
    const { error } = await deleteStudentMutation.mutation({
      url: userEndpoint.DELETE_MULTIPLE,
      method: 'delete',
      body: {
        user_ids: selectedStudents,
      },
    })
    if (error) {
      toast.error('Can not delete student')
      return
    }

    toast.success('Student deleted')
    reFetch()
    setIsOpenDelete(false)
    setSelectedStudents([])
  }

  return (
    <div className="mt-10">
      <Table
        isStriped
        aria-label="Student-list"
        selectionMode="multiple"
        selectedKeys={user?.role === Role.ADMIN ? selectedStudents : undefined}
        onSelectionChange={(keys) => {
          if (keys === 'all') setSelectedStudents((response?.results || []).map((student) => student.user.id))
          else setSelectedStudents(Array.from(keys) as string[])
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
          {(response?.results || []).map((student, index) => (
            <TableRow key={student.user.id}>
              <TableCell>{(page - 1) * RECORD_PER_PAGE + index + 1}</TableCell>
              <TableCell>{student.user.full_name}</TableCell>
              <TableCell>{student.user.email}</TableCell>
              <TableCell>{student.user.code}</TableCell>
              <TableCell>{student.class_instance.name}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  <Button isIconOnly color="primary" variant="flat" onClick={() => setSelectedStudent(student)}>
                    <FaEye className="text-lg" />
                  </Button>
                  {user?.role === Role.ADMIN && (
                    <Button
                      isIconOnly
                      color="warning"
                      variant="flat"
                      onClick={() => router.push(`/student/${student.user.id}/edit`)}
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
        total={Math.ceil((response?.count || 0) / RECORD_PER_PAGE)}
        onChange={(page) => {
          router.replace(
            updateSearchParams({
              page,
            }),
          )
        }}
      />
      <Modal
        isOpen={!!selectedStudent}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedStudent(null)
        }}
      >
        <ModalContent>
          <ModalBody>
            <Avatar
              src={`${API_URL}/${selectedStudent?.user.avatar}`}
              name={selectedStudent?.user.full_name}
              className="mx-auto w-40 aspect-square h-40 text-4xl"
              showFallback
            />
            <div className="mt-4">
              <p className="text-4xl font-semibold text-center">{selectedStudent?.user.full_name}</p>
              <p className="mt-2">Email: {selectedStudent?.user.email}</p>
              <p className="mt-2">Student code: {selectedStudent?.user.code}</p>
              <p className="mt-2">Class: {selectedStudent?.class_instance.name}</p>
              <p className="mt-1">Phone: {selectedStudent?.user.phone_number}</p>
              <p className="mt-1">Gender: {selectedStudent?.user.gender}</p>
              <p className="mt-1">Address: {selectedStudent?.user.address}</p>
              <p className="mt-1">DOB: {selectedStudent?.user.date_of_birth}</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <SendNotification
        isOpen={isOpen}
        loading={sendNotificationMutation.pending}
        title={
          <>
            Send notification to {selectedStudents.length ? 'selected' : <span className="text-blue-500">ALL</span>}{' '}
            Students
          </>
        }
        onOpenChange={(isOpen) => !isOpen && !sendNotificationMutation.pending && setIsOpen(false)}
        onSubmit={handleSendNotification}
      />
      {!!selectedStudents.length && (
        <div className="fixed z-50 left-1/2 -translate-x-1/2 bottom-20 bg-white shadow-md flex items-stretch rounded-lg px-1 overflow-hidden">
          <div className="p-2">{selectedStudents.length} students selected</div>
          <Button color="danger" isIconOnly variant="flat" onClick={() => setIsOpenDelete(true)}>
            <MdDeleteOutline />
          </Button>
          <Button isIconOnly variant="light" onClick={() => setSelectedStudents([])}>
            <IoMdClose />
          </Button>
        </div>
      )}
      <Modal isOpen={isOpenDelete}>
        <ModalContent>
          <ModalHeader>Delete students</ModalHeader>
          <ModalBody>
            <p>Confirm delete these selected student?</p>
            <p>
              This action <strong>can not</strong> be recoverable
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsOpenDelete(false)} isDisabled={deleteStudentMutation.pending} variant="light">
              Cancel
            </Button>
            <Button color="danger" isLoading={deleteStudentMutation.pending} onClick={handleDeleteStudents}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default forwardRef<StudentListRef>(StudentList)
