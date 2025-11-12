import { Suspense } from 'react'
import { Card, Grid, Stack, Text } from '@sanity/ui'

import { UserCardSkeleton } from './user-card-skeleton'
import { UsersLiveActive } from './users-live-active'
import { UsersLiveLeaderboard } from './users-live-leaderboard'

export function UsersLive() {
  return (
    <Grid columns={2} gap={4}>
      <Card tone="primary" padding={4} border radius={3}>
        <Stack space={3}>
          <Text size={1}>Currently active users</Text>
          <Suspense fallback={<UserCardSkeleton />}>
            <UsersLiveActive />
          </Suspense>
        </Stack>
      </Card>
      <Card tone="primary" padding={4} border radius={3}>
        <Stack space={3}>
          <Text size={1}>Leaderboard (last 30 days)</Text>
          <Suspense fallback={<UserCardSkeleton />}>
            <UsersLiveLeaderboard />
          </Suspense>
        </Stack>
      </Card>
    </Grid>
  )
}
