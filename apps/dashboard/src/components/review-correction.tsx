import { useSearchParams } from 'react-router'
import { Box, Button, Flex, Stack, Text } from '@sanity/ui'

import { CheckmarkCircleIcon } from '@sanity/icons'
import type { CorrectionData } from '../types'

export function ReviewCorrection({ data }: { data: CorrectionData }) {
  let [searchParams, setSearchParams] = useSearchParams()
  const highlightedBlock = searchParams.get('highlighted-block') === data.key

  const handleClick = () => {
    if (!data.key) {
      return
    }
    if (highlightedBlock) {
      setSearchParams((prev) => {
        prev.delete('highlighted-block')
        prev.delete('highlighted-text')
        return prev
      })
    } else {
      const block = document.querySelector(`[data-block-key="${data.key}"]`)
      if (block) {
        setSearchParams((prev) => {
          prev.set('highlighted-block', data.key)
          prev.set('highlighted-text', data.before)

          return prev
        })

        block.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <Flex gap={1} align="center">
      <Button
        onClick={handleClick}
        tone={highlightedBlock ? 'primary' : 'default'}
        mode={highlightedBlock ? 'ghost' : 'ghost'}
        disabled={!data.key}
      >
        <Box flex={1} paddingRight={2}>
          <Stack space={3}>
            {/* <Text size={1} style={{ textWrap: 'pretty' }}>
              {data.context}
            </Text> */}
            <Text size={1} style={{ textWrap: 'pretty' }}>
              {data.explanation}
            </Text>
          </Stack>
        </Box>
      </Button>
      <Button
        onClick={handleClick}
        tone={highlightedBlock ? 'positive' : 'default'}
        mode="bleed"
        icon={CheckmarkCircleIcon}
      />
    </Flex>
  )
}
