import { defineQuery } from 'groq'
import { useQuery } from '@sanity/sdk-react'

import { SECONDS_IN_30_DAYS, SECONDS_IN_60_DAYS } from '../../helpers/constants'
import { Stat } from '../stat'

type ActiveCertifiedUsersQueryResponse = {
  certifiedCurrent30: number
  certifiedPrevious30: number
}

const ACTIVE_CERTIFIED_USERS_QUERY = defineQuery(`{
  "certifiedCurrent30": count(*[
    _type == "progress" 
    && true in exams[].pass
    && dateTime(_updatedAt) > dateTime(now()) - $SECONDS_IN_30_DAYS
  ]),
  "certifiedPrevious30": count(*[
    _type == "progress" 
    && true in exams[].pass
    && dateTime(_updatedAt) <= dateTime(now()) - $SECONDS_IN_30_DAYS 
    && dateTime(_updatedAt) > dateTime(now()) - $SECONDS_IN_60_DAYS
  ])
}`)

export function ActiveCertifiedUsers() {
  const { data: users } = useQuery<ActiveCertifiedUsersQueryResponse>({
    query: ACTIVE_CERTIFIED_USERS_QUERY,
    params: {
      SECONDS_IN_30_DAYS,
      SECONDS_IN_60_DAYS,
    },
    useCdn: true,
  })

  return (
    <Stat
      number={users?.certifiedCurrent30}
      compareNumber={users?.certifiedPrevious30}
      label="Certified last 30 days"
    />
  )
}
