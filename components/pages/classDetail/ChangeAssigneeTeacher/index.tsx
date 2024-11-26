import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@nextui-org/button'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import { classEndpoint, userEndpoint } from '@/config/endpoints'
import { Role } from '@/helper/enums'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { IUser } from '@/types'

interface Props {
  classId: string
  changing: boolean
  onClose: () => void
  onUpdated: () => void
}

export default function ChangeAssigneeTeacher({ classId, changing, onClose, onUpdated }: Props) {
  const [teacherId, setTeacherId] = useState<string | null>(null)

  const { response: teachers, pending: getTeachersPending } = useGet<{
    results: IUser[]
  }>({
    url: userEndpoint.BASE,
    config: {
      params: {
        role: Role.TEACHER,
      },
    },
  })
  const changeTeacherMutation = useMutation()

  const handleUpdate = async () => {
    const { error } = await changeTeacherMutation.mutation({
      url: `${classEndpoint.BASE}/${classId}`,
      method: 'patch',
      body: {
        teacher: teacherId,
      },
    })

    if (error) {
      toast.error('Can not update')
      return
    }
    toast.success('Updated')
    onUpdated()
  }

  return (
    <Modal isOpen={changing} onClose={() => !changeTeacherMutation.pending && onClose()}>
      <ModalContent>
        <ModalHeader>Change assignee teacher</ModalHeader>
        <ModalBody>
          <Select
            isLoading={getTeachersPending}
            value={teacherId || ''}
            onChange={(e) => setTeacherId(e.target.value)}
            label="Teacher"
            variant="underlined"
          >
            {(teachers?.results || []).map((teacher) => (
              <SelectItem key={teacher.id}>{teacher.full_name}</SelectItem>
            ))}
          </Select>
          <div className="flex gap-4">
            <Button className="w-full" disabled={changeTeacherMutation.pending} onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="w-full"
              isLoading={changeTeacherMutation.pending}
              disabled={!teacherId}
              color="primary"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
