import { CheckmarkCircleIcon, CircleIcon } from '@sanity/icons'
import { Box, Button, Card, Grid, Select } from '@sanity/ui'
import { useSearchParams } from 'react-router'

import { SENTIMENTS } from '../helpers/constants'

export const DEFAULT_FILTERS = {
  sentiment: 'all',
  resolved: 'false',
}

export function FeedbackFilters() {
  const [searchParams] = useSearchParams(DEFAULT_FILTERS)

  const sentiment = searchParams.get('sentiment')
  const resolvedValue = searchParams.get('resolved')

  return (
    <Card
      borderBottom
      padding={3}
      style={{ position: 'sticky', top: 0, zIndex: 1 }}
    >
      <Grid columns={[2, 2, 2, 3]} gap={1}>
        <SentimentButtons sentiment={sentiment} />
        <ResolvedToggle resolvedValue={resolvedValue} />
      </Grid>
    </Card>
  )
}

function ResolvedToggle({ resolvedValue }: { resolvedValue: string | null }) {
  const [_, setSearchParams] = useSearchParams()

  const handleResolvedToggle = () => {
    setSearchParams((prev) => {
      const currentValue = prev.get('resolved')

      if (currentValue === 'true') {
        // Stage 2: true -> false
        prev.set('resolved', 'false')
      } else if (currentValue === 'false') {
        // Stage 3: false -> remove param
        prev.set('resolved', '')
      } else {
        // Stage 1: no param -> true
        prev.set('resolved', 'true')
      }
      return prev
    })
  }

  // Tooltip text and icon based on current state
  const getResolvedTooltipText = () => {
    if (resolvedValue === 'true') return 'Resolved'
    if (resolvedValue === 'false') return 'New'
    return 'All'
  }

  const getResolvedIcon = () => {
    if (resolvedValue === 'true') return CheckmarkCircleIcon
    if (resolvedValue === 'false') return CircleIcon
    return CheckmarkCircleIcon
  }

  return (
    <Button
      text={getResolvedTooltipText()}
      icon={getResolvedIcon()}
      mode={
        resolvedValue === 'true' || resolvedValue === 'false'
          ? 'default'
          : 'ghost'
      }
      padding={2}
      onClick={handleResolvedToggle}
      tone={
        resolvedValue === 'true' || resolvedValue === 'false'
          ? 'positive'
          : 'default'
      }
    />
  )
}

function SentimentButtons({ sentiment }: { sentiment: string | null }) {
  const [_, setSearchParams] = useSearchParams()

  return (
    <Box columnStart={1} columnEnd={3}>
      <Select
        value={sentiment || ''}
        onChange={(e) =>
          setSearchParams((prev) => {
            const currentValue = prev.get('sentiment')
            if (currentValue === 'all' || !e.currentTarget.value) {
              prev.delete('sentiment')
            } else {
              prev.set('sentiment', e.currentTarget.value)
            }

            return prev
          })
        }
      >
        {SENTIMENTS.map(({ title, value }) => (
          <option key={value} value={value}>
            {title}
          </option>
        ))}
      </Select>
    </Box>
  )
}
