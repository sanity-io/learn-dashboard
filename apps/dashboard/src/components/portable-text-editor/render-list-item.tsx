import { PropsWithChildren } from 'react'
import { BlockListItemRenderProps } from '@portabletext/editor'
import type { CardTone } from '@sanity/ui'
import { Box, Card, Flex, Text } from '@sanity/ui'

import {
  BookIcon,
  BulbOutlineIcon,
  CheckmarkCircleIcon,
  WarningOutlineIcon,
} from '@sanity/icons'

export function renderListItem(props: BlockListItemRenderProps) {
  if (props.schemaType.value === 'bullet') {
    return (
      <ul>
        <li>{props.children}</li>
      </ul>
    )
  } else if (props.schemaType.value === 'number') {
    return (
      <ol>
        <li>{props.children}</li>
      </ol>
    )
  } else if (props.schemaType.value === 'task') {
    return <IconCard tone="positive">{props.children}</IconCard>
  } else if (props.schemaType.value === 'action') {
    return <IconCard tone="primary">{props.children}</IconCard>
  } else if (props.schemaType.value === 'caution') {
    return <IconCard tone="caution">{props.children}</IconCard>
  } else if (props.schemaType.value === 'note') {
    return <IconCard tone="transparent">{props.children}</IconCard>
  }

  console.log(`Unhandled list item: ${props.schemaType.value}`)
  return <div>{props.children}</div>
}

function getIcon(tone: CardTone) {
  if (tone === 'positive') {
    return <CheckmarkCircleIcon />
  } else if (tone === 'primary') {
    return <BookIcon />
  } else if (tone === 'caution') {
    return <WarningOutlineIcon />
  } else if (tone === 'transparent') {
    return <BulbOutlineIcon />
  }
  return null
}

function IconCard({
  tone,
  children,
}: PropsWithChildren<{
  tone: CardTone
}>) {
  const Icon = getIcon(tone)
  return (
    <Card border radius={3} tone={tone}>
      <Flex paddingX={4} paddingY={3} gap={4} align="center">
        <Text size={3}>{Icon}</Text>
        <Box flex={1}>{children}</Box>
      </Flex>
    </Card>
  )
}
