import { ArrowTopRightIcon } from '@sanity/icons'
import { Button, Text, Tooltip } from '@sanity/ui'

type LinkToLearnProps = {
  pathname?: string
}

export function LinkToLearn(props: LinkToLearnProps) {
  const url = new URL(props.pathname || '', 'https://www.sanity.io')

  return (
    <Tooltip
      content={
        <Text muted size={1}>
          Open in Learn
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
        icon={ArrowTopRightIcon}
        padding={2}
        mode="ghost"
      />
    </Tooltip>
  )
}
