import { DocumentIcon } from '@sanity/icons'
import { Box, Button, Flex, Stack, Text, TextSkeleton } from '@sanity/ui'

export function ReviewLessonPreviewSkeleton() {
  return (
    <Button mode="bleed" padding={2} disabled>
      <Flex align="center" gap={3}>
        <Box style={{ flexShrink: 0 }}>
          <Text size={2}>
            <DocumentIcon />
          </Text>
        </Box>
        <Stack space={2}>
          <TextSkeleton size={1} />
          <TextSkeleton size={1} />
        </Stack>
      </Flex>
    </Button>
  )
}
