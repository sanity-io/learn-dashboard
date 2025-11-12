import { Suspense, useDeferredValue } from 'react'
import { useDocuments } from '@sanity/sdk-react'
import { Button, Container, Grid, Stack, TextInput } from '@sanity/ui'
import { useSearchParams } from 'react-router'

import { ReviewLessonPreview } from './review-lesson-preview'
import { ReviewLessonPreviewSkeleton } from './review-lesson-skeleton'

export function ReviewIndex() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query') || ''
  const deferredQuery = useDeferredValue(query)

  const { data, hasMore, loadMore } = useDocuments({
    documentType: 'lesson',
    filter: /* groq */ `title match $query + "*"`,
    params: { query: deferredQuery },
    orderings: [{ field: '_updatedAt', direction: 'desc' }],
    perspective: 'published',
  })

  return (
    <Container>
      <Stack space={2} paddingY={4}>
        <TextInput
          placeholder="Search lesson titles"
          onChange={(event) => {
            setSearchParams((prev) => {
              if (event.currentTarget.value) {
                prev.set('query', event.currentTarget.value)
              } else {
                prev.delete('query')
              }

              return prev
            })
          }}
        />
        <Stack space={1}>
          {data.map((lesson) => (
            <Suspense
              key={lesson.documentId}
              fallback={<ReviewLessonPreviewSkeleton />}
            >
              <ReviewLessonPreview handle={lesson} />
            </Suspense>
          ))}
        </Stack>
        {hasMore && (
          <Grid>
            <Button mode="ghost" onClick={loadMore} text="Load more" />
          </Grid>
        )}
      </Stack>
    </Container>
  )
}
