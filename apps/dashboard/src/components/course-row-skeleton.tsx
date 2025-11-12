import {
  ArrowTopRightIcon,
  ChartUpwardIcon,
  ChevronRightIcon,
  PanelLeftIcon,
} from '@sanity/icons'
import { Button, CodeSkeleton, Flex, TextSkeleton } from '@sanity/ui'

import { Cell, Row } from './table'

export function CourseRowSkeleton() {
  const Skeleton = () => (
    <Row borderTop>
      <Cell padding={2}>
        <Button icon={ChevronRightIcon} disabled padding={2} mode="bleed" />
      </Cell>
      <Cell padding={2} style={{ width: '100%' }}>
        <TextSkeleton />
      </Cell>
      <Cell padding={2}>
        <CodeSkeleton />
      </Cell>
      <Cell padding={2}>
        <CodeSkeleton />
      </Cell>

      <Cell padding={2}>
        <Flex gap={1} justify="flex-end">
          <Button icon={ArrowTopRightIcon} disabled padding={2} mode="ghost" />
          <Button icon={PanelLeftIcon} disabled padding={2} mode="ghost" />
          <Button icon={ChartUpwardIcon} disabled padding={2} mode="ghost" />
        </Flex>
      </Cell>
    </Row>
  )

  return Array.from({ length: 20 }).map((_, index) => <Skeleton key={index} />)
}
