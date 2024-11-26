import { DatePicker as DatePickerCommon, DatePickerProps } from '@nextui-org/date-picker'

interface Props extends DatePickerProps {
  error?: string | boolean
}

export default function DatePicker({ error, ...props }: Props) {
  return (
    <div>
      <DatePickerCommon {...props} />
      {error && typeof error === 'string' && <p className="text-xs mt-1 text-red-500">{error}</p>}
    </div>
  )
}
