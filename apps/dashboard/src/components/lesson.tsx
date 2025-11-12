import { Suspense } from 'react'
import { DocumentHandle, useDocumentProjection } from '@sanity/sdk-react'
import { Button, Code, Flex, Text } from '@sanity/ui'

import { PanelLeftIcon } from '@sanity/icons'
import { getPageviewsByPathname } from '../helpers/getPageviewsByPathname'
import { DateBadge } from './date-badge'
import { useFathom } from './fathom-provider'
import { LinkToFathom } from './link-to-fathom'
import { LinkToLearn } from './link-to-learn'
import { LinkToReview } from './link-to-review'
import { LinkToStudio } from './link-to-studio'
import { Cell, Row } from './table'

type LessonProjection = {
  _updatedAt: string
  title: string
  slug: string
}

type LessonProps = {
  handle: DocumentHandle
  coursePathname: string
}

export function Lesson(props: LessonProps) {
  const { data } = useDocumentProjection<LessonProjection>({
    ...props.handle,
    projection: `{
        _updatedAt,
        title,
        "slug": slug.current,
    }`,
    perspective: 'published',
  })

  const { stats } = useFathom()
  const pathname = `${props.coursePathname}/${data?.slug}`
  const formattedPageviews = getPageviewsByPathname(stats, pathname)

  return (
    <Row>
      <Cell paddingX={3} paddingY={2} />
      <Cell padding={2} style={{ width: '100%' }} borderTop>
        <Flex align="center" gap={2}>
          <Text size={1} textOverflow="ellipsis">
            {data?.title}
          </Text>
          <LinkToReview documentId={props.handle.documentId} />
        </Flex>
      </Cell>
      <Cell padding={2} borderTop>
        <Flex justify="flex-end">
          <Code size={1}>{formattedPageviews}</Code>
        </Flex>
      </Cell>
      <Cell padding={2} borderTop>
        <DateBadge date={data?._updatedAt} />
      </Cell>
      <Cell paddingX={3} paddingY={2} borderTop>
        <Flex justify="flex-end" gap={1}>
          <LinkToLearn pathname={pathname} />
          <Suspense
            fallback={
              <Button icon={PanelLeftIcon} disabled padding={2} mode="ghost" />
            }
          >
            <LinkToStudio handle={props.handle} />
          </Suspense>
          <LinkToFathom pathname={pathname} />
        </Flex>
      </Cell>
    </Row>
  )
}
