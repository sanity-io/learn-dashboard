import { Code, Flex, Stack, TextSkeleton } from '@sanity/ui'

export function StatSkeleton() {
  return (
    <Stack space={3}>
      <Flex paddingY={1} justify="flex-start">
        <Code size={4}>0</Code>
      </Flex>
      <TextSkeleton size={1} />
    </Stack>
  )
}
