import { Suspense } from 'react'
import {
  DocumentHandle,
  createDocumentHandle,
  deleteDocument,
  publishDocument,
  useApplyDocumentActions,
  useDocument,
  useEditDocument,
} from '@sanity/sdk-react'
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  useToast,
} from '@sanity/ui'
import { useNavigate } from 'react-router'

import { DocumentPreview } from './document-preview'
import { DocumentPreviewSkeleton } from './document-preview-skeleton'
import { SENTIMENTS } from '../helpers/constants'
import { relativeDate } from '../helpers/relativeDate'
import { FeedbackBadge } from './feedback-badge'

type FeedbackDocumentProps = {
  feedbackId: string
}

type Feedback = {
  _createdAt: string | null
  resolvedNote: string | null
  resolved: boolean | null
  feedback: string | null
  sentiment: string | null
  classification: string | null
  suggestedResponse: string | null
  user: {
    _ref: string | null
  } | null
  lesson: {
    _ref: string | null
  } | null
}

export function FeedbackDocument({ feedbackId }: FeedbackDocumentProps) {
  const handle = createDocumentHandle({
    documentId: feedbackId,
    documentType: 'learnFeedback',
  })

  const { data } = useDocument<Feedback>({
    ...handle,
  })

  const lessonId = data?.lesson?._ref
  const userId = data?.user?._ref

  return (
    <Container size={2}>
      <Card>
        <Stack space={5} padding={3}>
          <Stack space={4}>
            <Flex align="center" justify="space-between" gap={2}>
              <Text muted size={1}>
                {data?._createdAt ? relativeDate(data?._createdAt) : ''}
              </Text>
              <FeedbackBadge sentiment={data?.sentiment || ''} />
            </Flex>
            <Text size={3}>{data?.feedback}</Text>
          </Stack>
          <Stack space={3}>
            <Text muted size={1}>
              Resolved Note
            </Text>
            <Suspense
              fallback={
                <TextArea rows={3} disabled value={data?.resolvedNote || ''} />
              }
            >
              <EditResolvedNote
                handle={handle}
                value={data?.resolvedNote || ''}
              />
            </Suspense>
            <Flex gap={2} align="center">
              <Box flex={1}>
                <EditSentiment handle={handle} value={data?.sentiment || ''} />
              </Box>
              <Box>
                <Flex
                  as="label"
                  htmlFor="resolved-toggle"
                  gap={1}
                  align="center"
                >
                  <Suspense
                    fallback={
                      <Switch disabled checked={data?.resolved || false} />
                    }
                  >
                    <EditResolved
                      handle={handle}
                      value={data?.resolved || false}
                      id="resolved-toggle"
                    />
                  </Suspense>
                  <Text muted size={1}>
                    Resolved?
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <Stack space={3} paddingTop={4}>
              <Flex align="center" justify="space-between" gap={2}>
                <Text muted size={1}>
                  Suggested Response
                </Text>
                <Label muted size={1}>
                  Classification: {data?.classification || 'Other'}
                </Label>
              </Flex>
              <TextArea
                rows={3}
                disabled
                value={data?.suggestedResponse || ''}
              />
            </Stack>
          </Stack>
          <Grid columns={3} gap={2}>
            <Suspense fallback={<DocumentPreviewSkeleton />}>
              <DocumentPreview handle={handle} titlePath="feedback" />
            </Suspense>
            {lessonId && (
              <Suspense fallback={<DocumentPreviewSkeleton />}>
                <DocumentPreview
                  handle={createDocumentHandle({
                    documentId: lessonId,
                    documentType: 'lesson',
                  })}
                  titlePath="title"
                />
              </Suspense>
            )}
            {userId && (
              <Suspense fallback={<DocumentPreviewSkeleton />}>
                <DocumentPreview
                  handle={createDocumentHandle({
                    documentId: userId,
                    documentType: 'progress',
                  })}
                  titlePath="_id"
                />
              </Suspense>
            )}
          </Grid>
          <DeleteFeedback handle={handle} />
        </Stack>
      </Card>
    </Container>
  )
}

function EditResolvedNote({
  handle,
  value,
}: {
  handle: DocumentHandle
  value: Feedback['resolvedNote']
}) {
  const edit = useEditDocument({
    ...handle,
    path: 'resolvedNote',
  })

  return (
    <TextArea
      value={value || ''}
      onChange={(e) => edit(e.currentTarget.value)}
      rows={3}
    />
  )
}

function EditResolved({
  handle,
  value,
  id,
}: {
  handle: DocumentHandle
  value: Feedback['resolved']
  id: string
}) {
  const apply = useApplyDocumentActions()
  const edit = useEditDocument({
    ...handle,
    path: 'resolved',
  })

  const handleToggle = () => {
    edit(!value)
    // Instant publish changes because this schema type has liveMode true
    apply(publishDocument(handle))
  }

  return <Switch id={id} checked={value || false} onChange={handleToggle} />
}

function EditSentiment({
  handle,
  value,
}: {
  handle: DocumentHandle
  value: Feedback['sentiment']
}) {
  const edit = useEditDocument({
    ...handle,
    path: 'sentiment',
  })
  const apply = useApplyDocumentActions()
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    edit(e.currentTarget.value)
    // Instant publish changes because this schema type has liveMode true
    apply(publishDocument(handle))
  }

  return (
    <Select value={value || ''} onChange={handleChange}>
      <option value=""></option>
      {SENTIMENTS.filter(
        ({ value }) => value !== 'unknown' && value !== 'all',
      ).map(({ title, value }) => (
        <option key={value} value={value}>
          {title}
        </option>
      ))}
    </Select>
  )
}

function DeleteFeedback({ handle }: { handle: DocumentHandle }) {
  const toast = useToast()
  const navigate = useNavigate()
  const apply = useApplyDocumentActions()
  const handleDelete = () => {
    apply(deleteDocument(handle))
    toast.push({
      title: 'Feedback deleted',
      status: 'success',
    })
    navigate('/feedback')
  }

  return (
    <MenuButton
      button={<Button text="Delete feedback" tone="critical" mode="ghost" />}
      id="menu-button-example"
      menu={
        <Menu>
          <MenuItem
            text="Confirm deletion"
            onClick={handleDelete}
            tone="critical"
          />
        </Menu>
      }
      popover={{ portal: true }}
    />
  )
}
