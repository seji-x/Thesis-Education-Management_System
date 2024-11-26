import { CalendarDate } from '@internationalized/date'

export const updateSearchParams = (data: Record<string, number | string | null | undefined>) => {
  const searchParams = new URLSearchParams(window.location.search)

  for (const key in data) {
    if (data[key] || data[key] === 0) {
      searchParams.set(key, data[key] as string)
    } else searchParams.delete(key)
  }

  return `${window.location.pathname}?${searchParams.toString()}`
}

export const getDateValue = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number)

  return new CalendarDate(y, m, d)
}

export const formatString = (str: string, params: Record<string, string>) =>
  str.replace(/{(\w+)}/g, (_, key) => params[key] || '')
