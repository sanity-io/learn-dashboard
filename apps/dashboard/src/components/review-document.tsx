import { Suspense } from 'react'
import {
  DocumentHandle,
  createDocumentHandle,
  useDocument,
} from '@sanity/sdk-react'
import { PortableTextBlock } from '@portabletext/types'
import { Button, Card, Container, Flex, Heading, Stack } from '@sanity/ui'
import { useNavigate } from 'react-router'

import { ArrowLeftIcon, PanelLeftIcon } from '@sanity/icons'
import { LinkToStudio } from './link-to-studio'
import { PortableTextEditor } from './portable-text-editor'

type Lesson = {
  title: string
  content: Array<PortableTextBlock>
}

export function ReviewDocument({ documentId }: { documentId: string }) {
  const navigate = useNavigate()

  const handle = createDocumentHandle({
    documentId: documentId,
    documentType: 'lesson',
  })

  return (
    <Container size={4}>
      <Stack
        height="fill"
        overflow="auto"
        paddingX={4}
        paddingY={5}
        style={{
          scrollPadding: '50px',
        }}
      >
        <Flex justify="space-between">
          <Button
            mode="bleed"
            padding={2}
            icon={ArrowLeftIcon}
            onClick={() => navigate('/review')}
            text="Document list"
          />
          <Suspense
            fallback={
              <Button icon={PanelLeftIcon} disabled padding={2} mode="ghost" />
            }
          >
            <LinkToStudio handle={handle} />
          </Suspense>
        </Flex>

        <Suspense
          fallback={
            <Card marginY={2} paddingY={4} borderBottom>
              <Heading muted size={4} style={{ opacity: 0.5 }}>
                Loading...
              </Heading>
            </Card>
          }
        >
          <DocumentEditor handle={handle} />
        </Suspense>
      </Stack>
    </Container>
  )
}

type DocumentEditorProps = {
  handle: DocumentHandle
}

function DocumentEditor({ handle }: DocumentEditorProps) {
  const { data } = useDocument<Lesson>({
    ...handle,
  })

  return (
    <>
      <Card marginY={2} paddingY={4} borderBottom>
        <Heading size={4}>{data?.title}</Heading>
      </Card>
      <PortableTextEditor
        documentId={handle.documentId}
        documentType="lesson"
        path="content"
      />
    </>
  )
}
