import { useEffect, useState } from 'react'

export default function useDebounce<T>(init: T, delay = 700) {
  const [state, setState] = useState(init)

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(init)
    }, delay)

    return () => {
      clearTimeout(id)
    }
  }, [init])

  return state
}
