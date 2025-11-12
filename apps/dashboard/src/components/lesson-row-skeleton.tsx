import {
  ArrowTopRightIcon,
  ChartUpwardIcon,
  PanelLeftIcon,
} from '@sanity/icons'
import { Button, CodeSkeleton, Flex, TextSkeleton } from '@sanity/ui'

import { Cell, Row } from './table'

export function LessonRowSkeleton() {
  return (
    <Row>
      <Cell paddingX={3} paddingY={2} />
      <Cell padding={2} style={{ width: '100%' }} borderTop>
        <TextSkeleton />
      </Cell>
      <Cell padding={2} borderTop>
        <CodeSkeleton />
      </Cell>
      <Cell padding={2} borderTop>
        <CodeSkeleton />
      </Cell>
      <Cell paddingX={3} paddingY={2} borderTop>
        <Flex gap={1} justify="flex-end">
          <Button icon={ArrowTopRightIcon} disabled padding={2} mode="ghost" />
          <Button icon={PanelLeftIcon} disabled padding={2} mode="ghost" />
          <Button icon={ChartUpwardIcon} disabled padding={2} mode="ghost" />
        </Flex>
      </Cell>
    </Row>
  )
}
