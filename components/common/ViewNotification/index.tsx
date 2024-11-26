import moment from 'moment'
import { Avatar } from '@nextui-org/avatar'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import { INotification } from '@/types'

interface Props {
  isOpen: boolean
  notification: INotification | null
  onOpenChange: (isOpen: boolean) => void
}

export default function ViewNotification({ isOpen, notification, onOpenChange }: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-sm font-bold text-purple-900">Notification</h2>
        </ModalHeader>
        <ModalBody>
          <h3 className="text-xl font-bold">{notification?.title}</h3>
          <p className="bg-gray-50 p-2 rounded">{notification?.detail}</p>
          <div className="flex justify-between items-stretch">
            <div className="flex gap-2 items-center rounded-full border p-0.5 pr-6">
              <Avatar
                src={notification?.sender.avatar || undefined}
                showFallback
                name={notification?.sender.full_name}
              />
              <div>
                <p className="font-bold text-xs">{notification?.sender.full_name}</p>
                <p className="text-xs text-gray-500">{notification?.sender.role}</p>
              </div>
            </div>

            <div className="text-gray-600">
              <p className="text-xs">{moment(notification?.created_at).fromNow()}</p>
              <p className="text-xs">{moment(notification?.created_at).format('HH:mm DD/MM/yyyy')}</p>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
