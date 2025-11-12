import { Suspense } from 'react'
import { DocumentHandle } from '@sanity/sdk'
import { useDocumentProjection } from '@sanity/sdk-react'
import { Box, Button, Code, Flex, Text, Tooltip } from '@sanity/ui'

import { PanelLeftIcon } from '@sanity/icons'
import { getPageviewsByPathname } from '../helpers/getPageviewsByPathname'
import { DateBadge } from './date-badge'
import { useFathom } from './fathom-provider'
import { LinkToFathom } from './link-to-fathom'
import { LinkToLearn } from './link-to-learn'
import { LinkToStudio } from './link-to-studio'
import { LessonRowSkeleton } from './lesson-row-skeleton'
import { Cell, Row } from './table'
import { CourseInTrack } from './track-course'

type TrackProjection = {
  pathname: string
  title: string
  courses: DocumentHandle[]
  lastUpdated: string
}

type TrackProps = DocumentHandle

export function Track(props: TrackProps) {
  const { data } = useDocumentProjection<TrackProjection>({
    ...props,
    projection: /* groq */ `{
        "pathname": "/learn/track/" + slug.current,
        title,
        "courses": courses[_type == "course"]{
          "documentId": _ref,
          "documentType": "course",
          "projectId": sanity::projectId(),
          "dataset": sanity::dataset()
        },
        "lastUpdated": [_updatedAt, courses[]->._updatedAt, courses[]->.lessons[]->._updatedAt]|order(dateTime(@))[0]
    }`,
  })

  const { stats } = useFathom()
  const formattedPageviews = getPageviewsByPathname(stats, data?.pathname)

  return (
    <>
      <Row borderTop>
        <Cell colSpan={2} paddingLeft={3} padding={2} style={{ width: '100%' }}>
          <Text size={1} weight="semibold" textOverflow="ellipsis">
            {data?.title}
          </Text>
        </Cell>
        <Cell>
          <Flex justify="flex-end" padding={2}>
            <Code size={1}>{formattedPageviews}</Code>
          </Flex>
        </Cell>
        <Cell>
          <Tooltip
            content={
              <Text muted size={1}>
                Most recent track/course/lesson update
              </Text>
            }
            animate
            placement="top"
            portal
          >
            <Box padding={2}>
              <DateBadge date={data?.lastUpdated} />
            </Box>
          </Tooltip>
        </Cell>
        <Cell paddingX={3} paddingY={2}>
          <Flex justify="flex-end" gap={2}>
            <Flex align="center" gap={1}>
              <LinkToLearn pathname={data?.pathname} />
              <Suspense
                fallback={
                  <Button
                    icon={PanelLeftIcon}
                    disabled
                    padding={2}
                    mode="ghost"
                  />
                }
              >
                <LinkToStudio handle={props} />
              </Suspense>
              <LinkToFathom pathname={data?.pathname} />
            </Flex>
          </Flex>
        </Cell>
      </Row>
      {data.courses.map((course) => (
        <Suspense key={course.documentId} fallback={<LessonRowSkeleton />}>
          <CourseInTrack handle={course} trackPathname={data?.pathname} />
        </Suspense>
      ))}
    </>
  )
}
