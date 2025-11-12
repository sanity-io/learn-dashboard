import { Suspense, useRef } from 'react'
import { DocumentHandle, useDocumentProjection } from '@sanity/sdk-react'
import { Button, Code, Flex, Select, Text, Tooltip } from '@sanity/ui'

import { PanelLeftIcon } from '@sanity/icons'
import { COHORT_CATEGORIES } from './cohorts-wrapper'
import { EditCategory } from './edit-category'
import { LinkToLearn } from './link-to-learn'
import { LinkToStudio } from './link-to-studio'
import { Cell, Row } from './table'

type CohortData = {
  name: string
  slug: string
  code: string
  category: 'partner' | 'internal' | 'customer' | 'none' | null
  members: number
  certified: number
}

type CohortProps = {
  handle: DocumentHandle
  category: string | null
  onlyCertified: boolean
}

export function Cohort({ handle, category, onlyCertified }: CohortProps) {
  const ref = useRef<HTMLTableRowElement>(null)

  const { data } = useDocumentProjection<CohortData>({
    ...handle,
    ref,
    projection: /* groq */ `{
      name,
      "slug": slug.current,
      code,
      category,
      "members": count(*[
          _type == "progress" 
          && defined(cohort) 
          && cohort._ref == ^._id
      ]),
      "certified": count(*[
        _type == "progress" 
        && defined(cohort) 
        && cohort._ref == ^._id
        && true in exams[].pass
      ]),
    }`,
  })

  const pathname = data.slug ? `/learn/cohort/${data.slug}` : ''

  let mode: 'visible' | 'hidden' = 'visible'
  if (category !== 'all' && category !== data.category) {
    mode = 'hidden'
  }
  if (category === 'none' && !data.category) {
    mode = 'visible'
  }
  if (onlyCertified && data.certified === 0) {
    mode = 'hidden'
  }

  // TODO: Put <Activity> back
  if (mode !== 'visible') {
    return null
  }

  return (
    <Row
      borderTop
      // problematic?
      ref={ref}
    >
      <Cell paddingX={3} paddingY={2}>
        <Text size={1} weight="semibold" textOverflow="ellipsis">
          {data.name}
        </Text>
      </Cell>
      <Cell padding={2}>
        <Code size={1}>{data.code}</Code>
      </Cell>
      <Cell padding={2}>
        <Suspense
          fallback={
            <Select disabled value={data.category || ''}>
              <option value={data.category || ''}>
                {data.category ? COHORT_CATEGORIES[data.category] : ''}
              </option>
            </Select>
          }
        >
          <EditCategory handle={handle} />
        </Suspense>
      </Cell>
      <Cell padding={2}>
        <Flex justify="flex-end">
          <Tooltip
            content={
              <Text muted size={1}>
                {data.certified} Certified / {data.members} Members
              </Text>
            }
          >
            <Code size={1}>
              {data.certified}/{data.members}
            </Code>
          </Tooltip>
        </Flex>
      </Cell>
      <Cell paddingX={3} paddingY={2}>
        <Flex justify="flex-end" gap={1}>
          <LinkToLearn pathname={pathname} />
          <Suspense
            fallback={
              <Button icon={PanelLeftIcon} disabled padding={2} mode="ghost" />
            }
          >
            <LinkToStudio handle={handle} />
          </Suspense>
        </Flex>
      </Cell>
    </Row>
  )
}
