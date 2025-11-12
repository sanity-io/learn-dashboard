import { CheckmarkCircleIcon, CircleIcon } from '@sanity/icons'
import {
  DocumentHandle,
  createDocumentHandle,
  useDocument,
} from '@sanity/sdk-react'
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
  lesson: {
    _ref: string | null
  } | null
  resolved: boolean
}

export function FeedbackListItemSelected({ handle }: FeedbackListItemProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data } = useDocument<Projection>({ ...handle })

  return (
    <Button
      onClick={() =>
        navigate({
          pathname: `/feedback/${handle.documentId}`,
          search: searchParams.toString(),
        })
      }
      tone="primary"
      paddingX={3}
      paddingY={3}
    >
      <Stack space={3}>
        <Text size={1} textOverflow="ellipsis">
          {data?.feedback}
        </Text>
        <Flex align="center" gap={4} justify="space-between">
          <Stack space={3}>
            <Text size={1} muted textOverflow="ellipsis">
              {data?.lesson?._ref ? (
                <LessonTitle
                  handle={createDocumentHandle({
                    documentId: data?.lesson?._ref,
                    documentType: 'lesson',
                  })}
                />
              ) : (
                'Lesson'
              )}
            </Text>
            <Box>
              <FeedbackBadge sentiment={data?.sentiment || ''} />
            </Box>
          </Stack>
          <Text>
            {data?.resolved ? <CheckmarkCircleIcon /> : <CircleIcon />}
          </Text>
        </Flex>
      </Stack>
    </Button>
  )
}

type LessonTitleProps = {
  handle: DocumentHandle
}

function LessonTitle({ handle }: LessonTitleProps) {
  const { data } = useDocument<string>({ ...handle, path: 'title' })

  return data || 'Lesson'
}
