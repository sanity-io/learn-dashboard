import { defineQuery } from 'groq'
import { useQuery } from '@sanity/sdk-react'

import { Stat } from '../stat'

type CertifiedUsersQueryResponse = {
  certified: number
}

const CERTIFIED_USERS_QUERY = defineQuery(`{
  "certified": count(*[
    _type == "progress"
    && true in exams[].pass
  ])
}`)

export function CertifiedUsers() {
  const { data: users } = useQuery<CertifiedUsersQueryResponse>({
    query: CERTIFIED_USERS_QUERY,
    useCdn: true,
  })

  return <Stat number={users?.certified} label="Certified users" />
}
