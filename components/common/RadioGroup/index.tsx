import { RadioGroup as RadioGroupCommon, RadioGroupProps } from '@nextui-org/radio'

interface Props extends RadioGroupProps {
  error?: string | boolean
}

export default function RadioGroup({ error, ...props }: Props) {
  return (
    <div>
      <RadioGroupCommon {...props} />

      {error && typeof error === 'string' && <p className="mt-1 tect-xs text-red-500">{error}</p>}
    </div>
  )
}
