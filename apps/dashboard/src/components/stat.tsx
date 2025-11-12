import { Badge, Code, CodeSkeleton, Flex, Stack, Text } from '@sanity/ui'
import { CSSProperties, useEffect, useState } from 'react'
import { AnimatedNumber } from './animated-number'

const style: CSSProperties = {
  textWrap: 'balance',
}

type StatProps = {
  number: number
  compareNumber?: number
  label: string
}

export function Stat({ number, compareNumber, label }: StatProps) {
  const percentageChange = compareNumber
    ? ((number - compareNumber) / compareNumber) * 100
    : undefined
  const isPositive = percentageChange && percentageChange > 0

  const [initialNumber, setInitialNumber] = useState(0)
  useEffect(() => {
    setInitialNumber(number)
  }, [number])

  return (
    <Stack space={3}>
      <Flex gap={2} align="center" paddingY={1}>
        <Code size={4}>
          <AnimatedNumber value={initialNumber} />
        </Code>
        {percentageChange ? (
          <Badge tone={isPositive ? 'positive' : 'critical'}>
            {isPositive && '+'}
            {percentageChange.toFixed(2)}%
          </Badge>
        ) : (
          <Badge style={{ opacity: 0 }}>{` `}</Badge>
        )}
      </Flex>

      <Text size={1} style={style} muted>
        {label}
      </Text>
    </Stack>
  )
}

export type StatSkeletonProps = {
  label: string
}

export function StatSkeleton({ label }: StatSkeletonProps) {
  return (
    <Stack space={3}>
      <Flex gap={2} align="center" paddingY={1}>
        <CodeSkeleton muted size={4} />

        <Badge style={{ opacity: 0 }}>{` `}</Badge>
      </Flex>

      <Text size={1} style={style} muted>
        {label}
      </Text>
    </Stack>
  )
}
