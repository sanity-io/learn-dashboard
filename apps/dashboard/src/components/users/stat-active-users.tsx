import { defineQuery } from 'groq'
import { useQuery } from '@sanity/sdk-react'

import { Stat } from '../stat'
import { SECONDS_IN_30_DAYS, SECONDS_IN_60_DAYS } from '../../helpers/constants'

type ActiveUsersQueryResponse = {
  activeCurrent30: number
  activePrevious30: number
}

const ACTIVE_USERS_QUERY = defineQuery(`{
  "activeCurrent30": count(*[
    _type == "progress"
    && dateTime(_updatedAt) > dateTime(now()) - $SECONDS_IN_30_DAYS
  ]),
  "activePrevious30": count(*[
    _type == "progress"
    && dateTime(_updatedAt) <= dateTime(now()) - $SECONDS_IN_30_DAYS
    && dateTime(_updatedAt) > dateTime(now()) - $SECONDS_IN_60_DAYS
  ])
}`)

type ActiveUsersProps = {
  label: string
}

export function ActiveUsers({ label }: ActiveUsersProps) {
  const { data: users } = useQuery<ActiveUsersQueryResponse>({
    query: ACTIVE_USERS_QUERY,
    params: {
      SECONDS_IN_30_DAYS,
      SECONDS_IN_60_DAYS,
    },
    useCdn: true,
  })

  return (
    <Stat
      number={users?.activeCurrent30}
      compareNumber={users?.activePrevious30}
      label={label}
    />
  )
}
