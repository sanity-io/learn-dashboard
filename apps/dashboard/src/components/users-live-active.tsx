import { useDocuments } from '@sanity/sdk-react'
import { Stack } from '@sanity/ui'

import { UserCard } from './user-card'

export function UsersLiveActive() {
  const { data } = useDocuments({
    documentType: 'progress',
    filter: /* groq */ `defined(lessons)`,
    batchSize: 5,
    orderings: [{ field: '_updatedAt', direction: 'desc' }],
  })

  return (
    <Stack space={1}>
      {data.map((handle) => (
        <UserCard key={handle.documentId} handle={handle} />
      ))}
    </Stack>
  )
}
