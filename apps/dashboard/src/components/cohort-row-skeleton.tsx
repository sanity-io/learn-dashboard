import { ArrowTopRightIcon, PanelLeftIcon } from '@sanity/icons'
import { Button, CodeSkeleton, Flex, Select, TextSkeleton } from '@sanity/ui'

import { Cell, Row } from './table'

export function CohortRowSkeleton() {
  const Skeleton = () => (
    <Row borderTop>
      <Cell paddingX={3} paddingY={2}>
        <TextSkeleton />
      </Cell>
      <Cell padding={2}>
        <CodeSkeleton />
      </Cell>
      <Cell padding={2}>
        <Select disabled />
      </Cell>
      <Cell padding={2}>
        <CodeSkeleton />
      </Cell>
      <Cell paddingX={3} paddingY={2}>
        <Flex gap={1} justify="flex-end">
          <Button icon={ArrowTopRightIcon} disabled padding={2} mode="ghost" />
          <Button icon={PanelLeftIcon} disabled padding={2} mode="ghost" />
        </Flex>
      </Cell>
    </Row>
  )

  return Array.from({ length: 20 }).map((_, index) => <Skeleton key={index} />)
}
