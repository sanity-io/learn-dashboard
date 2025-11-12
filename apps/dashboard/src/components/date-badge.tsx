import { Badge } from '@sanity/ui'
import { formatDate } from '../helpers/formatDate'

export function DateBadge({ date }: { date: string }) {
  return (
    <Badge
      tone={isGreaterThan12MonthsAgo(date) ? 'caution' : 'neutral'}
      style={{
        whiteSpace: 'nowrap',
      }}
    >
      {formatDate(date)}
    </Badge>
  )
}

function isGreaterThan12MonthsAgo(date: string) {
  const dateObj = new Date(date)
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
  return dateObj < twelveMonthsAgo
}
