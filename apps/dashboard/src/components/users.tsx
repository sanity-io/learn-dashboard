import { Suspense } from 'react'
import { Card, Grid, Stack, Text } from '@sanity/ui'

import { LineGraph } from './users/line-graph'
import { ActiveCertifiedUsers } from './users/stat-active-certified-users'
import { ActiveUsers } from './users/stat-active-users'
import { CertifiedUsers } from './users/stat-certified-users'
import { TotalUsers } from './users/stat-total-users'
import { UserGrowth } from './users/user-growth'
import { StatSkeleton } from './stat'
import { UsersLive } from './users-live'

export function Users() {
  return (
    <Stack space={4} padding={4}>
      <Grid columns={2} gap={4}>
        <Card tone="primary" padding={4} border radius={3}>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Users
            </Text>
            <Grid columns={2} gap={4}>
              <Suspense fallback={<StatSkeleton label="Total users" />}>
                <TotalUsers label="Total users" />
              </Suspense>
              <Suspense
                fallback={<StatSkeleton label="Users active last 30 days" />}
              >
                <ActiveUsers label="Users active last 30 days" />
              </Suspense>
            </Grid>
          </Stack>
        </Card>

        <Card tone="primary" padding={4} border radius={3}>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Certifications
            </Text>
            <Grid columns={2} gap={3}>
              <Suspense fallback={<StatSkeleton label="Certified users" />}>
                <CertifiedUsers />
              </Suspense>
              <Suspense
                fallback={<StatSkeleton label="Certified last 30 days" />}
              >
                <ActiveCertifiedUsers />
              </Suspense>
            </Grid>
          </Stack>
        </Card>
      </Grid>
      <UsersLive />
      <Stack>
        <Card tone="primary" border radius={3} padding={4}>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              User sign ups
            </Text>
            <Suspense fallback={<LineGraph data={[]} />}>
              <UserGrowth />
            </Suspense>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  )
}
