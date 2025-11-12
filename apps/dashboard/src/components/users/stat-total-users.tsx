import { defineQuery } from 'groq'
import { useQuery } from '@sanity/sdk-react'

import { Stat, StatSkeletonProps } from '../stat'

type TotalUsersQueryResponse = {
  total: number
}

const TOTAL_USERS_QUERY = defineQuery(`{
  "total": count(*[_type == "progress"])
}`)

export function TotalUsers({ label }: StatSkeletonProps) {
  const { data: users } = useQuery<TotalUsersQueryResponse>({
    query: TOTAL_USERS_QUERY,
    useCdn: true,
  })

  return <Stat number={users?.total} label={label} />
}
