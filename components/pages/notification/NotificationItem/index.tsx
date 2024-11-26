import moment from 'moment'
import { twMerge } from 'tailwind-merge'
import { INotification } from '@/types'
import { Avatar } from '@nextui-org/avatar'
import { Card, CardBody } from '@nextui-org/card'

interface Props extends Pick<INotification, 'sender' | 'detail' | 'title' | 'status' | 'created_at'> {
  onClick: () => void
}
export default function NotificationItem({ created_at, detail, sender, status, title, onClick }: Props) {
  return (
    <Card
      className={twMerge(
        'shadow bg-gray-100 cursor-pointer hover:bg-blue-50 duration-200 relative w-full',
        !status && 'bg-white',
      )}
      radius="none"
      isPressable
      onClick={onClick}
    >
      <CardBody>
        <div className="flex gap-2">
          {!status && (
            <span className="absolute top-3 right-3 w-1.5 aspect-square block bg-blue-600 rounded-full"></span>
          )}
          <Avatar
            src={sender.avatar || undefined}
            showFallback
            name={sender.full_name}
            className="shrink-0"
            size="lg"
          />
          <div className="grow flex flex-col self-stretch">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="line-clamp-1 text-sm">{detail}</p>
            <p className="text-[10px] text-gray-500 text-right font-semibold mt-auto">
              {moment(created_at).format('HH:mm dd/MM/yyyy')}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
