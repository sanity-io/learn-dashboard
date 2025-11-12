import { Suspense } from 'react'
import { useParams } from 'react-router'
import { Card, Grid } from '@sanity/ui'

import { FeedbackDocument } from './feedback-document'
import { FeedbackFilters } from './feedback-filters'
import { FeedbackList } from './feedback-list'
import { FeedbackListSkeleton } from './feedback-list-skeleton'
import { Loading } from './loading'

export function Feedback() {
  const { feedbackId } = useParams()

  return (
    <Grid columns={3} height="fill" overflow="hidden">
      <Card columnStart={1} columnEnd={2} height="fill" overflow="auto">
        <FeedbackFilters />
        <Suspense fallback={<FeedbackListSkeleton />}>
          <FeedbackList feedbackId={feedbackId} />
        </Suspense>
      </Card>
      <Card
        columnStart={2}
        columnEnd={4}
        padding={4}
        borderLeft
        height="fill"
        overflow="auto"
      >
        {feedbackId && (
          <Suspense
            fallback={<Loading message="Loading feedback document..." />}
          >
            <FeedbackDocument feedbackId={feedbackId} />
          </Suspense>
        )}
      </Card>
    </Grid>
  )
}
