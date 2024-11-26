interface Props {
  label: string
  value?: string | number
}

export default function Block({ label, value }: Props) {
  return (
    <div className="bg-white rounded-xl p-5">
      <p className="text-lg font-semibold">{label}</p>
      <div className="aspect-square flex items-center justify-center text-8xl font-bold relative text-purple-800">
        {value}
        <span className="absolute w-3/4 aspect-square block rounded-full border-3 border-current"></span>
      </div>
    </div>
  )
}
