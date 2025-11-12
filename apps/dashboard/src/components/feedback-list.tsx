import { Suspense } from 'react'
import { useDocuments } from '@sanity/sdk-react'
import { Button, Card, Stack } from '@sanity/ui'
import { useSearchParams } from 'react-router'

import { DEFAULT_FILTERS } from './feedback-filters'
import { FeedbackListItem } from './feedback-list-item'
import { FeedbackListItemSelected } from './feedback-list-selected'
import { FeedbackListItemSkeleton } from './feedback-list-item-skeleton'

type FeedbackListProps = {
  feedbackId?: string
}

export function FeedbackList({ feedbackId }: FeedbackListProps) {
  const [searchParams] = useSearchParams(DEFAULT_FILTERS)

  const sentiment = searchParams.get('sentiment')
  const resolved = searchParams.get('resolved')

  const { data, hasMore, loadMore } = useDocuments({
    documentType: 'learnFeedback',
    filter: /* groq */ `
      defined(feedback) 
      && select(
        $sentiment == 'unknown' => !defined(sentiment),
        $sentiment == 'all' => true,
        defined($sentiment) => sentiment == $sentiment,
        true
      )
      && select(
        $resolved == 'true' => resolved == true,
        $resolved == 'false' => resolved != true,
        true
      )
      `,
    params: { sentiment, resolved },
    orderings: [{ field: '_updatedAt', direction: 'desc' }],
  })

  return (
    <Stack>
      <Stack padding={2} space={1}>
        {data.map((handle) => (
          <Suspense
            key={handle.documentId}
            fallback={<FeedbackListItemSkeleton />}
          >
            {feedbackId === handle.documentId ? (
              <FeedbackListItemSelected handle={handle} />
            ) : (
              <FeedbackListItem handle={handle} />
            )}
          </Suspense>
        ))}
        <Card padding={4} borderTop>
          {hasMore && (
            <Stack>
              <Button
                mode="ghost"
                padding={2}
                onClick={loadMore}
                text="Load more"
              />
            </Stack>
          )}
        </Card>
      </Stack>
    </Stack>
  )
}
