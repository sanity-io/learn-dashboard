import { createDocumentHandle, useDocument, useQuery } from '@sanity/sdk-react'
import { Avatar, Button, Flex, Text, Tooltip } from '@sanity/ui'
import { ThemeColorAvatarColorKey } from '@sanity/ui/theme'
import { useSearchParams } from 'react-router'

import { urlFor } from '../helpers/urlFor'

const COURSES_AUTHORS_QUERY = /* groq */ `array::unique(*[
  _type == "course"
  && defined(authors)
]{
  "authors": authors[]._ref
}.authors[])`

const AVATAR_COLORS: ThemeColorAvatarColorKey[] = [
  'blue',
  'purple',
  'magenta',
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
]

type CoursesAuthorsQueryResponse = string[]

export function CoursesAuthors() {
  const { data: ids } = useQuery<CoursesAuthorsQueryResponse>({
    query: COURSES_AUTHORS_QUERY,
    useCdn: true,
  })

  return (
    <Flex gap={1}>
      {ids.map((id, index) => (
        <CourseAuthorAvatar
          key={id}
          documentId={id}
          color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
        />
      ))}
    </Flex>
  )
}

type AuthorDocument = {
  bio: string
  mugshot: {
    _type: 'image'
    asset: {
      _ref: string
      _type: string
    }
  }
  name: string
  relation: string
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
}

function CourseAuthorAvatar({
  documentId,
  color,
}: {
  documentId: string
  color: (typeof AVATAR_COLORS)[number]
}) {
  const handle = createDocumentHandle({
    documentId,
    documentType: 'author',
  })
  const { data } = useDocument<AuthorDocument>({ ...handle })

  const imageRef = data?.mugshot?.asset._ref
  const imageUrl = typeof imageRef === 'string' ? urlFor(imageRef).url() : ''
  const [, setSearchParams] = useSearchParams()

  return (
    <Tooltip content={<Text size={1}>{data?.name}</Text>}>
      <Button
        mode="bleed"
        padding={0}
        onClick={() => {
          setSearchParams((prev) => {
            prev.set('author', documentId)
            return prev
          })
        }}
      >
        <Avatar
          size={1}
          initials={data?.name}
          src={imageUrl}
          name={data?.name}
          color={color}
        />
      </Button>
    </Tooltip>
  )
}
