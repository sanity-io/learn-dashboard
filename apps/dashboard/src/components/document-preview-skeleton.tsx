import { Button, Flex, TextSkeleton } from '@sanity/ui'
import { PanelLeftIcon } from '@sanity/icons'

export function DocumentPreviewSkeleton() {
  return (
    <Flex>
      <Button icon={PanelLeftIcon} disabled padding={2} mode="ghost" />
      <TextSkeleton />
    </Flex>
  )
}
