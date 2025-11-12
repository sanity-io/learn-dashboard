import { DocumentHandle, useDocument } from '@sanity/sdk-react'
import { Flex, Stack, Text } from '@sanity/ui'
import { LinkToStudio } from './link-to-studio'

type DocumentPreviewProps = {
  handle: DocumentHandle
  titlePath: string
}

export function DocumentPreview({ handle, titlePath }: DocumentPreviewProps) {
  const { data } = useDocument<string | null>({ ...handle, path: titlePath })

  return (
    <Flex gap={2} align="center">
      <LinkToStudio
        handle={handle}
        label={`Open "${handle.documentType}" document in Studio`}
      />
      <Stack space={2}>
        <Text size={1} weight="semibold" textOverflow="ellipsis">
          {data}
        </Text>
        <Text size={1} muted textOverflow="ellipsis">
          {handle.documentType}
        </Text>
      </Stack>
    </Flex>
  )
}
