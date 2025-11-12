import { useNavigate } from 'react-router'
import { CommentIcon } from '@sanity/icons'
import { Button, Text, Tooltip } from '@sanity/ui'

type LinkToReviewProps = {
  documentId?: string
}

export function LinkToReview(props: LinkToReviewProps) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/review/${props.documentId}`)
  }
  return (
    <Tooltip
      content={
        <Text muted size={1}>
          Open in Review
        </Text>
      }
      animate
      placement="top"
      portal
    >
      <Button
        disabled={!props.documentId}
        onClick={handleClick}
        icon={CommentIcon}
        padding={2}
        mode="bleed"
      />
    </Tooltip>
  )
}
