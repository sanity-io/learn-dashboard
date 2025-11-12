import { formatDistanceToNow } from 'date-fns'

export function relativeDate(date: string | Date) {
  let dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}
