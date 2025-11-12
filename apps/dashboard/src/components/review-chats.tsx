import { Suspense } from 'react'
import {
  DocumentHandle,
  deleteDocument,
  useApplyDocumentActions,
  useDocument,
  useDocuments,
} from '@sanity/sdk-react'
import { Button, Flex, Stack, Text } from '@sanity/ui'
import { useLocation, useNavigate } from 'react-router'

import { CheckmarkCircleIcon } from '@sanity/icons'
import { removeTrailingSlash } from '../helpers/removeTrailingSlash'
import { REVIEW_TYPES, ReviewStart } from './review-start'

type ReviewChatProps = {
  documentId: string
}

export function ReviewChats({ documentId }: ReviewChatProps) {
  const { data: chats } = useDocuments({
    documentType: 'learnReviewChat',
    filter: `target._ref == $documentId`,
    params: { documentId },
  })
  const apply = useApplyDocumentActions()

  if (chats.length === 0) {
    return <ReviewStart documentId={documentId} />
  }

  return (
    <Stack padding={3} space={2}>
      {chats.map((chat) => (
        <Suspense
          key={chat.documentId}
          fallback={<Button disabled text="Loading..." />}
        >
          <OpenChatButton handle={chat} />
        </Suspense>
      ))}

      {chats.length > 0 && (
        <Button
          mode="ghost"
          tone="critical"
          text="Abandon review workflow"
          onClick={() => {
            for (const chat of chats) {
              apply(deleteDocument(chat))
            }
          }}
        />
      )}
    </Stack>
  )
}

function OpenChatButton({ handle }: { handle: DocumentHandle }) {
  const { data } = useDocument<{ title: string | null }>({ ...handle })
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const reviewType = REVIEW_TYPES.find((type) => type.title === data?.title)
  const Icon = reviewType?.icon || CheckmarkCircleIcon

  return (
    <Button
      mode="bleed"
      padding={3}
      onClick={() =>
        navigate(`${removeTrailingSlash(pathname)}/${handle.documentId}`)
      }
    >
      <Flex gap={3}>
        <Text size={5}>
          <Icon />
        </Text>
        <Stack space={3} flex={1}>
          <Text size={1} weight="semibold">
            {reviewType?.title}
          </Text>
          <Text size={1} muted style={{ textWrap: 'balance' }}>
            {reviewType?.description}
          </Text>
        </Stack>
      </Flex>
    </Button>
  )
}
