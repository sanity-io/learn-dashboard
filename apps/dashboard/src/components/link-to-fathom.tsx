import { ChartUpwardIcon } from '@sanity/icons'
import { Button, Text, Tooltip } from '@sanity/ui'

type LinkToFathomProps = {
  pathname?: string
}

export function LinkToFathom(props: LinkToFathomProps) {
  const url = new URL('https://app.usefathom.com')
  url.searchParams.set('comparison', 'none')
  url.searchParams.set('filters[0][operator]', 'matching')
  url.searchParams.set('filters[0][property]', 'Page')
  url.searchParams.set('filters[0][value]', `^${props.pathname}$`)
  url.searchParams.set('range', 'all_time')
  url.searchParams.set('site', 'AEGXJIAW')

  return (
    <Tooltip
      content={
        <Text muted size={1}>
          Open in Fathom
        </Text>
      }
      animate
      placement="top"
      portal
    >
      <Button
        disabled={!props.pathname}
        as="a"
        href={url.toString()}
        target="_blank"
        icon={ChartUpwardIcon}
        padding={2}
        mode="ghost"
      />
    </Tooltip>
  )
}
