import { Suspense } from 'react'
import { Box, Button, Card, Flex, Grid, Spinner, Text } from '@sanity/ui'
import { useNavigate } from 'react-router'

import { ArrowUpIcon } from '@sanity/icons'
import { ReviewChatFetcher } from './review-chat-fetcher'
import { ReviewChats } from './review-chats'
import { ReviewDocument } from './review-document'

type ReviewProps = {
  documentId: string
  chatId?: string
}

export function Review({ documentId, chatId }: ReviewProps) {
  const navigate = useNavigate()

  return (
    <Grid columns={3} height="fill">
      <Card columnStart={1} columnEnd={3} overflow="auto">
        <ReviewDocument documentId={documentId} />
      </Card>
      <Card columnStart={3} columnEnd={4} borderLeft height="fill">
        <Flex direction="column" height="fill">
          <Card paddingX={3} paddingY={3} borderBottom>
            <Flex align="center" justify="space-between">
              <Text size={1} weight="semibold">
                Review workflow
              </Text>
              <Button
                disabled={!chatId}
                padding={2}
                mode="bleed"
                icon={ArrowUpIcon}
                onClick={() => navigate(`/review/${documentId}`)}
                text="Reviews"
              />
            </Flex>
          </Card>
          {chatId ? (
            <Suspense
              fallback={
                <Box padding={4}>
                  <Spinner />
                </Box>
              }
            >
              <ReviewChatFetcher documentId={documentId} chatId={chatId} />
            </Suspense>
          ) : (
            <ReviewChats documentId={documentId} />
          )}
        </Flex>
      </Card>
    </Grid>
  )
}
