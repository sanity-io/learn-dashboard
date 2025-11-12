import { SanityDocument } from '@sanity/sdk'
import { UIMessage } from 'ai'
import { KeyedSegment } from 'sanity'

// Define custom data types for message parts
export type CorrectionData = {
  id: string
  key: string
  type: 'spelling' | 'grammar' | 'style'
  original: string
  suggestion: string
  before: string
  after: string
  context: string
  explanation: string
  status: 'found' | 'processing' | 'completed'
}

export type NotificationData = {
  message: string
  level: 'info' | 'warning' | 'error'
}

// Define the typed UIMessage with custom data parts
export type TypedUIMessage = UIMessage<
  never, // metadata type
  {
    correction: CorrectionData
    notification: NotificationData
  }
>

export type LearnReviewChat = SanityDocument & {
  _type: 'learnReviewChat'
  _id: string
  title: string
  messages: (KeyedSegment & TypedUIMessage)[]
}
