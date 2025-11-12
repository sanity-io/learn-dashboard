import { Suspense } from 'react'
import { useDocuments } from '@sanity/sdk-react'
import { Button, Text } from '@sanity/ui'

import { Cell, Row } from './table'
import { CourseRowSkeleton } from './course-row-skeleton'
import { Track } from './track'

export function Tracks() {
  const {
    data: tracks,
    hasMore,
    loadMore,
  } = useDocuments({
    documentType: 'track',
    orderings: [{ field: '_updatedAt', direction: 'desc' }],
    perspective: 'published',
  })

  return (
    <>
      {tracks.length === 0 && (
        <Row>
          <Cell>
            <Text>No tracks found</Text>
          </Cell>
        </Row>
      )}
      {tracks.map((track) => (
        <Suspense key={track.documentId} fallback={<CourseRowSkeleton />}>
          <Track {...track} />
        </Suspense>
      ))}
      {hasMore && (
        <Row>
          <Cell>
            <Button onClick={loadMore} text="Load more" />
          </Cell>
        </Row>
      )}
    </>
  )
}
