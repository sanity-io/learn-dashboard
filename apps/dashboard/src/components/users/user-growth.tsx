import groq from 'groq'
import { useQuery } from '@sanity/sdk-react'

import { LineGraph } from './line-graph'

const LEARN_USER_QUERY = groq`
{
  "users": *[
    _type == "progress"
    && dateTime(_createdAt) > dateTime("2024-01-31T23:59:59Z")
  ] {
    _createdAt
  }
}`

type UserGrowthQueryResponse = {
  users: {
    _createdAt: string
  }[]
}

export function UserGrowth() {
  const { data } = useQuery<UserGrowthQueryResponse>({
    query: LEARN_USER_QUERY,
  })

  return <LineGraph data={data?.users || []} />
}
