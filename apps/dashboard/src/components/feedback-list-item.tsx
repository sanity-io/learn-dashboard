import { CheckmarkCircleIcon, CircleIcon } from '@sanity/icons'
import { DocumentHandle, useDocumentProjection } from '@sanity/sdk-react'
import { Box, Button, Flex, Stack, Text } from '@sanity/ui'
import { useNavigate, useSearchParams } from 'react-router'

import { FeedbackBadge } from './feedback-badge'

type FeedbackListItemProps = {
  handle: DocumentHandle
}

type Projection = {
  _updatedAt: string
  feedback: string | null
  sentiment: string | null
  lesson: string | null
  resolved: boolean
}

export function FeedbackListItem({ handle }: FeedbackListItemProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data } = useDocumentProjection<Projection>({
    ...handle,
    projection: /* groq */ `{ 
        _updatedAt, 
        feedback, 
        sentiment, 
        "lesson": lesson->title, 
        resolved 
    }`,
  })

  return (
    <Button
      onClick={() =>
        navigate({
          pathname: `/feedback/${handle.documentId}`,
          search: searchParams.toString(),
        })
      }
      mode="bleed"
      paddingX={3}
      paddingY={3}
    >
      <Stack space={3}>
        <Text size={1} textOverflow="ellipsis">
          {data.feedback}
        </Text>
        <Flex align="center" gap={4} justify="space-between">
          <Stack space={3}>
            <Text size={1} muted textOverflow="ellipsis">
              {data.lesson}
            </Text>
            <Box>
              <FeedbackBadge sentiment={data.sentiment || ''} />
            </Box>
          </Stack>
          <Text>
            {data.resolved ? <CheckmarkCircleIcon /> : <CircleIcon />}
          </Text>
        </Flex>
      </Stack>
    </Button>
  )
}
