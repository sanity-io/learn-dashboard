import { Suspense } from 'react'
import { useDocuments } from '@sanity/sdk-react'
import { Button, Inline, Text } from '@sanity/ui'

import { Cell, Row } from './table'
import { CourseRowSkeleton } from './course-row-skeleton'
import { CourseInTrack } from './track-course'
import { LinkToLearn } from './link-to-learn'

export function UntrackedCourses() {
  const {
    data: courses,
    hasMore,
    loadMore,
  } = useDocuments({
    documentType: 'course',
    filter:
      '!(_id in *[_type == "track" && defined(courses)].courses[]._ref) && (visibility == "public" || !defined(visibility))',
    orderings: [{ field: '_updatedAt', direction: 'desc' }],
    perspective: 'published',
  })

  return (
    <>
      <Row borderTop>
        <Cell colSpan={4} padding={3}>
          <Inline space={1}>
            <Text weight="semibold" size={1}>
              Dangling Courses
            </Text>
            <Text muted size={1}>
              (not in a track)
            </Text>
          </Inline>
        </Cell>
        <Cell paddingX={3} paddingY={2}>
          <LinkToLearn />
        </Cell>
      </Row>
      {courses.length === 0 && (
        <Row>
          <Cell>
            <Text>No untracked courses found</Text>
          </Cell>
        </Row>
      )}
      {courses.map((course) => (
        <Suspense key={course.documentId} fallback={<CourseRowSkeleton />}>
          <CourseInTrack handle={course} trackPathname="" />
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
