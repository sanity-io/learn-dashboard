import { Suspense } from 'react'
import { useDocuments } from '@sanity/sdk-react'
import { Button, Flex } from '@sanity/ui'

import { Cell, Row } from './table'
import { Cohort } from './cohort'
import { CohortRowSkeleton } from './cohort-row-skeleton'

type CohortsProps = {
  query: string
  category: string
  onlyCertified: boolean
}

export function Cohorts({ query, category, onlyCertified }: CohortsProps) {
  const { data, hasMore, loadMore, isPending, count } = useDocuments({
    documentType: 'cohort',
    // batchSize: 50,
    filter: /* groq */ `select(
      length($query) > 0 => name match $query + "*",
      true
    ) 
    && select(
      $category == 'none' => !defined(category),
      $category == 'all' => true,
      defined($category) => lower(category) == lower($category),
      true
    )`,
    params: { query, category },
    orderings: [{ field: 'name', direction: 'asc' }],
  })

  const visible = data.length
  const total = count

  return (
    <>
      {data.map((handle) => (
        <Suspense key={handle.documentId} fallback={<CohortRowSkeleton />}>
          <Cohort
            handle={handle}
            category={category}
            onlyCertified={onlyCertified}
          />
        </Suspense>
      ))}
      {hasMore && (
        <Row borderTop>
          <Cell colSpan={5} padding={3}>
            <Flex justify="center">
              <Button
                disabled={isPending}
                onClick={loadMore}
                mode="ghost"
                text={`Load more (fetched ${visible}/${total})`}
              />
            </Flex>
          </Cell>
        </Row>
      )}
    </>
  )
}
