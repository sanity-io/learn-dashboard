import { CircleIcon } from '@sanity/icons'
import { Badge, Box, Button, Flex, Stack, Text, TextSkeleton } from '@sanity/ui'

export function FeedbackListItemSkeleton() {
  return (
    <Button disabled paddingY={4} paddingX={3} mode="bleed">
      <Stack space={3}>
        <TextSkeleton />
        <Flex align="center" gap={4} justify="space-between">
          <Stack space={3}>
            <TextSkeleton size={1} muted />
            <Box>
              <Badge tone="default">Loading...</Badge>
            </Box>
          </Stack>
          <Text>
            <CircleIcon />
          </Text>
        </Flex>
      </Stack>
    </Button>
  )
}
