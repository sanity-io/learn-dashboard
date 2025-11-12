import { Avatar, Flex, Stack, TextSkeleton } from '@sanity/ui'

export function UserCardSkeleton() {
  const UserCard = () => (
    <Flex align="center" gap={2}>
      <Avatar size={1} />
      <TextSkeleton />
    </Flex>
  )

  return (
    <Stack space={1}>
      {Array.from({ length: 5 }).map((_, index) => (
        <UserCard key={index} />
      ))}
    </Stack>
  )
}
