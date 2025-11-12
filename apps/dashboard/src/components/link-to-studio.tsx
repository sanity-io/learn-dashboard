import { PanelLeftIcon } from '@sanity/icons'
import { DocumentHandle, useNavigateToStudioDocument } from '@sanity/sdk-react'
import { Button, Text, Tooltip } from '@sanity/ui'

type LinkToStudioProps = {
  label?: string
  handle: DocumentHandle
}

export function LinkToStudio({
  handle,
  label = 'Open in Studio',
}: LinkToStudioProps) {
  const { navigateToStudioDocument } = useNavigateToStudioDocument({
    ...handle,
  })

  return (
    <Tooltip
      content={
        <Text muted size={1}>
          {label}
        </Text>
      }
      animate
      placement="top"
      portal
    >
      <Button
        onClick={() => navigateToStudioDocument()}
        icon={PanelLeftIcon}
        padding={2}
        mode="ghost"
      />
    </Tooltip>
  )
}
