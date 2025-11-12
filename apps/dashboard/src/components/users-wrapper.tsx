import { Suspense } from 'react'

import { Loading } from './loading'
import { Users } from './users'

export function UsersWrapper() {
  return (
    <Suspense fallback={<Loading message="Loading users..." />}>
      <Users />
    </Suspense>
  )
}
