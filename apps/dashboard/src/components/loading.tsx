import { Flex, Spinner, Text } from '@sanity/ui'

export function Loading({ message }: { message?: string }) {
  return (
    <Flex
      direction="column"
      gap={5}
      justify="center"
      align="center"
      width="100vw"
      padding={5}
    >
      <Spinner />
      <Text size={1} muted>
        {message || 'Loading...'}
      </Text>
    </Flex>
  )
}
