import { useParams } from 'react-router'

import { Review } from './review'
import { ReviewIndex } from './review-index'

export function ReviewWrapper() {
  const { id, chatId } = useParams<{ id: string; chatId: string }>()

  return id ? <Review documentId={id} chatId={chatId} /> : <ReviewIndex />
}
