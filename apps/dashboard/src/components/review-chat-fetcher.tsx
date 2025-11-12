import { useDocument } from '@sanity/sdk-react'
import { Box, Flex } from '@sanity/ui'

import { LearnReviewChat } from '../types'
import { ReviewChat } from './review-chat'

type ReviewChatFetcherProps = {
  documentId: string
  chatId: string
}

export function ReviewChatFetcher({
  documentId,
  chatId,
}: ReviewChatFetcherProps) {
  const { data } = useDocument<LearnReviewChat>({
    documentId: chatId,
    documentType: 'learnReviewChat',
  })

  if (!data) {
    return null
  }

  return (
    <Flex direction="column" style={{ maxHeight: '100%', height: '100%' }}>
      <Box flex={1}>
        <ReviewChat data={data} documentId={documentId} chatId={chatId} />
      </Box>
    </Flex>
  )
}
