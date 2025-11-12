import {
  Suspense,
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from 'react'
import { Button, Flex, Stack, Switch, Text, TextInput } from '@sanity/ui'
import { useSearchParams } from 'react-router'

import { Cell, Row, Table } from './table'
import { Cohorts } from './cohorts'
import { CohortRowSkeleton } from './cohort-row-skeleton'

export const COHORT_CATEGORIES = {
  all: 'All',
  partner: 'Partner',
  internal: 'Internal',
  customer: 'Customer',
  none: 'None',
}

export function CohortsWrapper() {
  const [searchParams, setSearchParams] = useSearchParams({
    onlyCertified: 'true',
    category: 'partner',
  })

  const [query, setQuery] = useState(searchParams.get('query') || '')
  const deferredQuery = useDeferredValue(query)
  useEffect(() => {
    setSearchParams((prev) => {
      if (deferredQuery) {
        prev.set('query', deferredQuery)
      } else {
        prev.delete('query')
      }
      return prev
    })
  }, [deferredQuery])

  const onlyCertified = searchParams.get('onlyCertified') === 'true'
  const category =
    (searchParams.get('category') as keyof typeof COHORT_CATEGORIES) || 'all'

  const handleSetCategory = (key: keyof typeof COHORT_CATEGORIES) => {
    startTransition(() => {
      const prev = new URLSearchParams(searchParams)
      if (key === 'all') {
        prev.delete('category')
      } else {
        prev.set('category', key)
      }
      setSearchParams(prev)
    })
  }

  return (
    <Stack>
      <Flex justify="space-between" align="center" padding={3}>
        <Flex gap={1}>
          {Object.entries(COHORT_CATEGORIES).map(([key, value]) => (
            <Button
              key={key}
              onClick={() =>
                handleSetCategory(key as keyof typeof COHORT_CATEGORIES)
              }
              mode={category === key ? 'default' : 'bleed'}
              tone={category === key ? 'primary' : 'default'}
              text={value}
              padding={2}
            />
          ))}
        </Flex>

        <Flex gap={3} justify="flex-end" align="center">
          <label>
            <Flex gap={1} align="center">
              <Switch
                label="Only certified"
                checked={onlyCertified}
                onChange={() =>
                  setSearchParams((prev) => {
                    if (onlyCertified) {
                      prev.set('onlyCertified', 'false')
                    } else {
                      prev.set('onlyCertified', 'true')
                    }
                    return prev
                  })
                }
              />
              <Text size={1}>Certified</Text>
            </Flex>
          </label>
          <TextInput
            placeholder="Search cohort name"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </Flex>
      </Flex>
      <Table>
        <thead>
          <Row borderTop>
            <Cell padding={3} tone="transparent" style={{ width: '50%' }}>
              <Text weight="semibold" size={1}>
                Name
              </Text>
            </Cell>
            <Cell
              paddingY={3}
              padding={2}
              tone="transparent"
              style={{ width: '15%' }}
            >
              <Text weight="semibold" size={1}>
                Code
              </Text>
            </Cell>
            <Cell
              paddingY={3}
              padding={2}
              tone="transparent"
              style={{ width: '15%' }}
            >
              <Text weight="semibold" size={1}>
                Category
              </Text>
            </Cell>
            <Cell
              paddingY={3}
              padding={2}
              tone="transparent"
              style={{ width: '10%' }}
            >
              <Flex justify="flex-end">
                <Text weight="semibold" size={1}>
                  Members
                </Text>
              </Flex>
            </Cell>
            <Cell
              paddingY={3}
              padding={2}
              tone="transparent"
              style={{ width: '10%' }}
            />
          </Row>
        </thead>
        <tbody>
          <Suspense fallback={<CohortRowSkeleton />}>
            <Cohorts
              query={deferredQuery}
              category={category}
              onlyCertified={onlyCertified}
            />
          </Suspense>
        </tbody>
      </Table>
    </Stack>
  )
}
