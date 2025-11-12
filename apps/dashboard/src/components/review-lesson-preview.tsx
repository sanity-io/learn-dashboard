import { DocumentIcon } from '@sanity/icons'
import { DocumentHandle, useDocumentProjection } from '@sanity/sdk-react'
import { Box, Button, Flex, Stack, Text } from '@sanity/ui'
import { useNavigate } from 'react-router'

type ReviewLessonPreviewProps = {
  handle: DocumentHandle
}

type Lesson = {
  title: string | null
  course: {
    title: string | null
  } | null
}

export function ReviewLessonPreview({ handle }: ReviewLessonPreviewProps) {
  const navigate = useNavigate()
  const { data } = useDocumentProjection<Lesson>({
    ...handle,
    projection: /* groq */ `{
        title,
        "course": *[_type == "course" && ^._id in lessons[]._ref][0]{
            title
        }
    }`,
  })

  return (
    <Button
      mode="bleed"
      padding={2}
      onClick={() => navigate(`/review/${handle.documentId}`)}
    >
      <Flex align="center" gap={3}>
        <Box style={{ flexShrink: 0 }}>
          <Text size={2}>
            <DocumentIcon />
          </Text>
        </Box>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            {data.title}
          </Text>
          <Text size={1} muted>
            {data.course?.title || '[Not attached to a course]'}
          </Text>
        </Stack>
      </Flex>
    </Button>
  )
}
