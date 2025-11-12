import { Badge, BadgeTone } from '@sanity/ui'

export function FeedbackBadge({ sentiment }: { sentiment: string }) {
  return (
    <Badge tone={getSentimentTone(sentiment)}>
      {getSentimentLabel(sentiment)}
    </Badge>
  )
}

function getSentimentTone(sentiment: string): BadgeTone {
  if (sentiment === 'positive') {
    return 'positive'
  } else if (sentiment === 'negative') {
    return 'caution'
  } else if (sentiment === 'constructive') {
    return 'primary'
  }
  return 'neutral'
}

function getSentimentLabel(sentiment: string): string {
  if (sentiment === 'positive') {
    return 'Positive'
  } else if (sentiment === 'negative') {
    return 'Negative'
  } else if (sentiment === 'constructive') {
    return 'Constructive'
  }
  return 'Unknown'
}
