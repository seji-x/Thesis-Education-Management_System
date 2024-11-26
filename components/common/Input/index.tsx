import { Input as InputCommon, InputProps } from '@nextui-org/input'

interface Props extends InputProps {
  error?: string | boolean
}

export default function Input({ error, ...props }: Props) {
  return (
    <div>
      <InputCommon {...props} />
      {error && typeof error === 'string' && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
