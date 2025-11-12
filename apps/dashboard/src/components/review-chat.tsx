import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { useEditDocument } from '@sanity/sdk-react'
import {
  Box,
  Button,
  Card,
  Flex,
  Spinner,
  Stack,
  Text,
  TextArea,
  useToast,
} from '@sanity/ui'
import { DefaultChatTransport } from 'ai'

import { ArrowUpIcon, ResetIcon } from '@sanity/icons'
import { BACKEND_SERVICE_ORIGIN } from '../helpers/constants'
import { LearnReviewChat, TypedUIMessage } from '../types'
import { ReviewCorrection } from './review-correction'

export function ReviewChat({
  documentId,
  chatId,
  data,
}: {
  documentId: string
  chatId: string
  data: LearnReviewChat
}) {
  const toast = useToast()
  const edit = useEditDocument({
    documentId: chatId,
    documentType: 'learnReviewChat',
    path: 'messages',
  })
  const { messages, sendMessage, status, setMessages } =
    useChat<TypedUIMessage>({
      id: chatId,
      messages: data.messages,
      transport: new DefaultChatTransport({
        api: new URL('/ai/chat', BACKEND_SERVICE_ORIGIN).toString(),
        body: { documentId, title: data.title },
      }),
      // onData: ({ data, type, id }) => {
      //   console.log('onData', { data, type, id })
      // },
      onFinish: (data) => {
        if (Array.isArray(data.messages)) {
          const messagesWithKeys = data.messages.map((message) => ({
            ...message,
            _key: message.id,
          }))
          edit(messagesWithKeys as any)
        }
      },
      onError: (error) => {
        console.error('error', error)
        toast.push({
          title: error.name,
          status: 'error',
          description: error.message,
        })
      },
    })
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length === 0) {
      sendMessage({ text: 'Please begin the review process.' })
    }
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Auto-scroll to bottom when new messages are being written
  useEffect(() => {
    if (status !== 'ready' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, status])

  const submitMessage = () => {
    if (input.trim()) {
      sendMessage({ text: input })
      setInput('')
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      submitMessage()
    }
  }

  return (
    <Flex direction="column" style={{ maxHeight: '100%', height: '100%' }}>
      {/* Messages container - scrollable, takes remaining space */}
      <Box flex={1} style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <Box padding={3} paddingY={4}>
            <Text muted size={1}>
              No messages yet
            </Text>
          </Box>
        )}
        <Stack style={{ height: '100%' }} overflow="auto">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            const hasCorrections = message.parts.some(
              (part) => part.type === 'data-correction',
            )

            return (
              <Box
                key={message.id}
                paddingY={2}
                paddingLeft={isUser ? 5 : 2}
                paddingRight={isUser ? 2 : 5}
              >
                <Card
                  key={message.id}
                  paddingX={isUser ? 3 : 0}
                  paddingY={isUser ? 3 : 1}
                  tone={isUser ? 'primary' : 'default'}
                  radius={4}
                >
                  <Stack space={1}>
                    {message.parts
                      .filter((part) =>
                        // only show corrections is they exist
                        hasCorrections ? part.type === 'data-correction' : true,
                      )
                      .map((part, index) => {
                        if (part.type === 'step-start') {
                          return null
                        } else if (part.type === 'text') {
                          return (
                            <Text key={index} size={1}>
                              <span key={index}>{part.text}</span>
                            </Text>
                          )
                        } else if (part.type === 'data-correction') {
                          return (
                            <ReviewCorrection data={part.data} key={part.id} />
                          )
                        }

                        console.log(`unhandled part type`, part)
                        return null
                      })}
                  </Stack>
                </Card>
              </Box>
            )
          })}
          {status === 'submitted' && (
            <Box padding={4}>
              <Spinner />
            </Box>
          )}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} style={{ height: 10 }} />
        </Stack>
      </Box>

      {/* Input container - sticky at bottom */}
      <Card
        padding={2}
        borderTop
        style={{
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Flex as="form" onSubmit={handleSubmit} gap={1} align="flex-start">
          <Card tone="default" flex={1}>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              // disabled={status !== 'ready'}
              placeholder={`Ask me about...`}
              ref={inputRef}
            />
          </Card>
          <Flex gap={1} direction="column">
            <Button
              mode="bleed"
              padding={2}
              type="submit"
              // disabled={status !== 'ready'}
              icon={ArrowUpIcon}
            />
            <Button
              padding={2}
              mode="ghost"
              tone="critical"
              icon={ResetIcon}
              onClick={() => {
                setMessages([])
                edit([] as any)
              }}
            />
          </Flex>
        </Flex>
      </Card>
    </Flex>
  )
}
