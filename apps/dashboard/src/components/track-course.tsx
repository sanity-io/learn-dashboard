import { Suspense, startTransition } from 'react'
import { DocumentHandle } from '@sanity/sdk'
import { useDocumentProjection } from '@sanity/sdk-react'
import { Button, Code, Flex, Text, Tooltip } from '@sanity/ui'
import { useSearchParams } from 'react-router'

import { ChevronDownIcon, ChevronRightIcon, PanelLeftIcon } from '@sanity/icons'
import { getPageviewsByPathname } from '../helpers/getPageviewsByPathname'
import { DateBadge } from './date-badge'
import { useFathom } from './fathom-provider'
import { Lesson } from './lesson'
import { LinkToFathom } from './link-to-fathom'
import { LinkToLearn } from './link-to-learn'
import { LinkToStudio } from './link-to-studio'
import { LessonRowSkeleton } from './lesson-row-skeleton'
import { Cell, Row } from './table'

type CourseProjection = {
  pathname: string
  title: string
  lessons: DocumentHandle[]
  lastUpdated: string
}

type CourseInTrackProps = {
  handle: DocumentHandle
  trackPathname: string
}

export function CourseInTrack(props: CourseInTrackProps) {
  const { data } = useDocumentProjection<CourseProjection>({
    ...props.handle,
    projection: /* groq */ `{
        "pathname": "/learn/course/" + slug.current,
        title,
        "lessons": lessons[_type == "lesson"]{
          "documentId": _ref,
          "documentType": "lesson",
          "projectId": sanity::projectId(),
          "dataset": sanity::dataset()
        },
        "lastUpdated": [_updatedAt, lessons[]->._updatedAt]|order(dateTime(@))[0]
    }`,
  })

  const { stats } = useFathom()
  const formattedPageviews = getPageviewsByPathname(stats, data?.pathname)

  const [searchParams, setSearchParams] = useSearchParams()
  const handleOpenCourses = () => {
    startTransition(() => {
      setSearchParams((prev) => {
        const currentOpenCourses = prev.getAll('openCourses')
        const isOpen = currentOpenCourses.includes(props.handle.documentId)
        if (isOpen) {
          prev.delete('openCourses')
          currentOpenCourses
            .filter((id) => id !== props.handle.documentId)
            .forEach((id) => prev.append('openCourses', id))
        } else {
          prev.append('openCourses', props.handle.documentId)
        }
        return prev
      })
    })
  }

  const lessonsOpen =
    Array.isArray(data.lessons) &&
    searchParams.getAll('openCourses').includes(props.handle.documentId)

  return (
    <>
      <Row>
        <Cell paddingX={3} paddingY={2}>
          <Tooltip
            content={
              <Text muted size={1}>
                {lessonsOpen ? 'Hide lessons' : 'Show lessons'}
              </Text>
            }
            animate
            placement="top"
            portal
          >
            <Button
              icon={lessonsOpen ? ChevronDownIcon : ChevronRightIcon}
              onClick={handleOpenCourses}
              mode={lessonsOpen ? 'ghost' : 'bleed'}
              padding={2}
            />
          </Tooltip>
        </Cell>
        <Cell padding={2} style={{ width: '100%' }} borderTop>
          <Text size={1} weight="semibold" textOverflow="ellipsis">
            {data?.title}
          </Text>
        </Cell>
        <Cell padding={2} borderTop>
          <Tooltip
            content={
              <Text muted size={1}>
                Total for course and lessons
              </Text>
            }
            animate
            placement="top"
            portal
          >
            <Flex justify="flex-end">
              <Code size={1}>{formattedPageviews}</Code>
            </Flex>
          </Tooltip>
        </Cell>
        <Cell padding={2} borderTop>
          <DateBadge date={data?.lastUpdated} />
        </Cell>
        <Cell paddingX={3} paddingY={2} borderTop>
          <Flex justify="flex-end" gap={1}>
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
              <LinkToStudio handle={props.handle} />
            </Suspense>
            <LinkToFathom pathname={data?.pathname} />
          </Flex>
        </Cell>
      </Row>
      {lessonsOpen &&
        Array.isArray(data?.lessons) &&
        data.lessons.map((lesson) => (
          <Suspense key={lesson.documentId} fallback={<LessonRowSkeleton />}>
            <Lesson handle={lesson} coursePathname={data?.pathname} />
          </Suspense>
        ))}
    </>
  )
}
