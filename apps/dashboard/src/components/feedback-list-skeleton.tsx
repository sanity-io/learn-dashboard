import { Stack } from '@sanity/ui'

import { FeedbackListItemSkeleton } from './feedback-list-item-skeleton'

export function FeedbackListSkeleton() {
  return (
    <Stack padding={2} space={1}>
      {Array.from({ length: 10 }).map((_, index) => (
        <FeedbackListItemSkeleton key={index} />
      ))}
    </Stack>
  )
}
