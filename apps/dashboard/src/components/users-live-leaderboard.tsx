import { useDocuments } from '@sanity/sdk-react'
import { Stack } from '@sanity/ui'

import { UserCard } from './user-card'
import { SECONDS_IN_30_DAYS } from '../helpers/constants'

// "certifiedCurrent30": count(*[_type == "progress" && count(exams[pass == true]) > 0 && dateTime(_updatedAt) > dateTime(now()) - $SECONDS_IN_30_DAYS]),

export function UsersLiveLeaderboard() {
  const { data } = useDocuments({
    documentType: 'progress',
    filter: /* groq */ `
      defined(lessons)
      && dateTime(_updatedAt) > dateTime(now()) - $SECONDS_IN_30_DAYS
    `,
    params: { SECONDS_IN_30_DAYS },
    batchSize: 5,
    orderings: [{ field: 'count(lessons)', direction: 'desc' }],
  })

  return (
    <Stack space={1}>
      {data.map((handle) => (
        <UserCard key={handle.documentId} handle={handle} />
      ))}
    </Stack>
  )
}
