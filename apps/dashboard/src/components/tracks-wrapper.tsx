import { Suspense } from 'react'
import { Flex, Stack, Text, TextInput } from '@sanity/ui'

import { Cell, Row, Table } from './table'
import { CourseRowSkeleton } from './course-row-skeleton'
import { CoursesAuthors } from './courses-authors'
import { Tracks } from './tracks'
import { UntrackedCourses } from './untracked-courses'

export function TracksWrapper() {
  return (
    <Stack>
      <Flex justify="space-between" align="center" paddingY={3} paddingX={4}>
        <CoursesAuthors />
        <TextInput placeholder="Search courses" />
      </Flex>
      <Table>
        <thead>
          <Row>
            <Cell colSpan={2} paddingLeft={3} padding={2} tone="transparent">
              <Text size={1} weight="semibold">
                Title
              </Text>
            </Cell>
            <Cell paddingY={3} padding={2} tone="transparent">
              <Text size={1} weight="semibold" style={{ whiteSpace: 'nowrap' }}>
                Page views
              </Text>
            </Cell>
            <Cell paddingY={3} padding={2} tone="transparent">
              <Text size={1} weight="semibold" style={{ whiteSpace: 'nowrap' }}>
                Last updated
              </Text>
            </Cell>
            <Cell padding={3} tone="transparent" />
          </Row>
        </thead>
        <tbody>
          <Suspense fallback={<CourseRowSkeleton />}>
            <Tracks />
          </Suspense>
          <Suspense fallback={<CourseRowSkeleton />}>
            <UntrackedCourses />
          </Suspense>
        </tbody>
      </Table>
    </Stack>
  )
}
