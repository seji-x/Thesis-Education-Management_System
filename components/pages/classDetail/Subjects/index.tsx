import { useState } from 'react'
import { useParams } from 'next/navigation'

import { Button } from '@nextui-org/button'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import { Spinner } from '@nextui-org/spinner'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { FaLock, FaLockOpen, FaPlus } from 'react-icons/fa'
import { GrSchedules } from 'react-icons/gr'
import { useGet } from '@/hooks/useGet'
import { classSubjectEndpoint, scheduleEndpoint } from '@/config/endpoints'
import { IClassSubject, ISchedule, ISubject, IUser, TClassSubjectStatus } from '@/types'
import AddSubject from '../AddSubject'
import Schedule from '../Schelude'
import EditSubject from '../EditSubject'
import { BiSolidEditAlt } from 'react-icons/bi'
import { useMutation } from '@/hooks/useMutation'
import toast from 'react-hot-toast'
import { axiosInstance } from '@/services/axiosInstance'

const tableCols: { key: string; label: string }[] = [
  {
    key: 'no',
    label: 'No',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'teacher',
    label: 'Teacher',
  },
  {
    key: 'year',
    label: 'Year',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'action',
    label: '',
  },
]

export default function Subjects() {
  const { id } = useParams()
  const [open, setOpen] = useState(false)
  const [selectedSubjectSchedule, setSelectedSubjectSchedule] = useState<null | {
    id: string
    subject: ISubject
    teacher_id?: IUser
    status: TClassSubjectStatus
  }>(null)
  const [selectedClassSubjectEdit, setSelectedClassSubjectEdit] = useState<IClassSubject | null>(null)

  const {
    response: subjectResponse,
    pending,
    reFetch,
  } = useGet<{
    results: IClassSubject[]
  }>({
    url: classSubjectEndpoint.BASE,
    config: {
      params: {
        class_instance: id,
      },
    },
  })

  const updateStatusMutation = useMutation()

  const handleChangeStatus = async (classSubjectId: string, status: TClassSubjectStatus) => {
    if (status === 'CLOSED') {
      try {
        const response = await axiosInstance.get<{ results: ISchedule[] }>(scheduleEndpoint.BASE, {
          params: {
            class_subject_id: classSubjectId,
          },
        })

        await Promise.all(
          response.data.results.map((schedule) => axiosInstance.delete(`${scheduleEndpoint.BASE}/${schedule.id}`)),
        )
      } catch (error) {
        toast.error('Can not lock class subject')
        return
      }
    }

    const { error } = await updateStatusMutation.mutation({
      method: 'patch',
      url: `${classSubjectEndpoint.BASE}/${classSubjectId}`,
      body: {
        status,
      },
    })

    if (error) {
      toast.error('Can not update')
      return
    }
    toast.success('Updated')
    reFetch()
  }

  return (
    <div>
      <Button color="primary" endContent={<FaPlus />} onClick={() => setOpen(true)}>
        Add Subject
      </Button>
      <Table className="mt-6">
        <TableHeader columns={tableCols}>
          {(col) => (
            <TableColumn key={col.key} align="center">
              {col.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody loadingContent={<Spinner />} isLoading={pending}>
          {(subjectResponse?.results || []).map((classSubject, index) => (
            <TableRow key={classSubject.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{classSubject.subject.name}</TableCell>
              <TableCell>{classSubject.teacher_id?.full_name}</TableCell>
              <TableCell>
                {classSubject.year} {classSubject.semester && ` - ${classSubject.semester}`}
              </TableCell>
              <TableCell>{classSubject.status}</TableCell>
              <TableCell>
                {classSubject.status === 'ACTIVE' ? (
                  <div className="flex gap-1 items-center justify-center">
                    <Button
                      isIconOnly
                      color="primary"
                      variant="flat"
                      onClick={() => setSelectedSubjectSchedule(classSubject)}
                    >
                      <GrSchedules />
                    </Button>
                    <Button
                      isIconOnly
                      color="secondary"
                      variant="flat"
                      onClick={() => setSelectedClassSubjectEdit(classSubject)}
                    >
                      <BiSolidEditAlt />
                    </Button>
                    <Button
                      isIconOnly
                      color="warning"
                      variant="flat"
                      onClick={() => handleChangeStatus(classSubject.id, 'CLOSED')}
                    >
                      <FaLock />
                    </Button>
                  </div>
                ) : (
                  <Button
                    isIconOnly
                    color="success"
                    variant="flat"
                    onClick={() => handleChangeStatus(classSubject.id, 'ACTIVE')}
                  >
                    <FaLockOpen />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <h2>Add subject</h2>
          </ModalHeader>
          <ModalBody>
            <AddSubject
              classSubjects={subjectResponse?.results || []}
              onFinish={() => {
                setOpen(false)
                reFetch()
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={!!selectedSubjectSchedule}
        onOpenChange={(isOpen) => !isOpen && setSelectedSubjectSchedule(null)}
        size="full"
      >
        <ModalContent>
          <Schedule teacherId={selectedSubjectSchedule?.teacher_id?.id} classSubjectId={selectedSubjectSchedule?.id!} />
        </ModalContent>
      </Modal>
      <EditSubject
        open={!!selectedClassSubjectEdit}
        classSubject={selectedClassSubjectEdit}
        onClose={() => setSelectedClassSubjectEdit(null)}
        onFinish={() => {
          reFetch()
          setSelectedClassSubjectEdit(null)
        }}
      />
    </div>
  )
}
