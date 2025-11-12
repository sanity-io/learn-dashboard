import { BookIcon, CheckmarkCircleIcon, EarthGlobeIcon } from '@sanity/icons'
import { useClient } from '@sanity/sdk-react'
import { Button, Stack, useToast } from '@sanity/ui'

type ReviewChatProps = {
  documentId: string
}

export const REVIEW_TYPES = [
  {
    title: 'Spelling and grammar',
    description: 'Review the document complies with our US English rules.',
    icon: CheckmarkCircleIcon,
  },
  {
    title: 'Foreign concepts',
    description: 'Check for unexplained product names or technical terms.',
    icon: EarthGlobeIcon,
  },
  {
    title: 'Style guide',
    description:
      'Keep course material consistent with the Sanity writing guide.',
    icon: BookIcon,
  },
]

export function ReviewStart({ documentId }: ReviewChatProps) {
  const toast = useToast()
  const client = useClient({ apiVersion: '2025-09-15' })
  const handleClick = async () => {
    const transaction = client.transaction()
    for (const reviewType of REVIEW_TYPES) {
      transaction.create({
        _type: 'learnReviewChat',
        target: {
          _type: 'reference',
          _ref: documentId,
        },
        title: reviewType.title,
        messages: [],
      })
    }
    await transaction
      .commit()
      .then(() => {
        toast.push({
          title: 'Review started',
          status: 'success',
        })
      })
      .catch((err) => {
        console.error(err)
        toast.push({
          title: 'Error starting review',
          status: 'error',
        })
      })
  }

  return (
    <Stack padding={2}>
      <Button
        tone="primary"
        text="Start review workflow"
        onClick={handleClick}
      />
    </Stack>
  )
}
