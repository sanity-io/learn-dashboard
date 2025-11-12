import { Box, Stack } from '@sanity/ui'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type DateObject = { _createdAt: string }

interface ChartData {
  month: string
  count: number
  quarter: string
}

function chunkByUniqueMonths(
  dates: DateObject[],
): Record<string, DateObject[]> {
  const result: Record<string, DateObject[]> = {}

  dates.forEach((dateObj) => {
    const date = new Date(dateObj._createdAt)
    const yearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}`

    if (!result[yearMonth]) {
      result[yearMonth] = []
    }

    result[yearMonth].push(dateObj)
  })

  // sort into an ordered array by month
  const ordered = Object.keys(result).sort((a, b) => a.localeCompare(b))
  const orderedResult: Record<string, DateObject[]> = {}
  ordered.forEach((key) => {
    orderedResult[key] = result[key]
  })

  return orderedResult
}

function prepareChartData(dates: DateObject[]): ChartData[] {
  const months = chunkByUniqueMonths(dates)

  // Get only the last 12 months
  const monthEntries = Object.entries(months)
  const last12Months = monthEntries.slice(-12)

  return last12Months.map(([month, monthData], index) => {
    const quarterIndex = Math.floor(index / 3)
    const year = month.split('-')[0]
    const quarter = `${year}-Q${quarterIndex + 1}`

    return {
      month,
      count: monthData.length,
      quarter,
    }
  })
}

function getQuarterBoundaries(chartData: ChartData[]): string[] {
  const boundaries: string[] = []

  // Add first month as Q1 boundary
  if (chartData.length > 0) {
    boundaries.push(chartData[0].month)
  }

  // Add quarter boundaries (every 3 months after the first)
  chartData.forEach((item, index) => {
    if (index > 0 && index % 3 === 0) {
      boundaries.push(item.month)
    }
  })

  return boundaries
}

export function LineGraph({ data }: { data: DateObject[] }) {
  const chartData = prepareChartData(data)
  const quarterBoundaries = getQuarterBoundaries(chartData)

  return (
    <Stack
      space={4}
      style={{
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Monthly Line Chart */}
      <Box style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--card-border-color)"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [
                Intl.NumberFormat('en-US').format(value),
                'Users',
              ]}
              labelFormatter={(label: string) => `Month: ${label}`}
            />
            {/* Quarter boundary reference lines */}
            {quarterBoundaries.map((month, index) => (
              <ReferenceLine
                key={month}
                x={month}
                stroke="var(--card-border-color)"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `Q${index + 1}`,
                  position: 'top',
                  fill: 'var(--card-badge-primary-fg-color)',
                  fontSize: 10,
                  fontFamily: 'sans-serif',
                }}
              />
            ))}
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--card-badge-primary-fg-color)"
              strokeWidth={1}
              dot={{
                fill: 'var(--card-badge-primary-fg-color)',
                r: 3,
              }}
              activeDot={{
                opacity: 1,
                r: 6,
                fill: 'var(--card-badge-primary-fg-color)',
                stroke: 'var(--card-badge-primary-fg-color)',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  )
}
