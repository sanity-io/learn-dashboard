import {
  BlockChildRenderProps,
  RenderChildFunction,
} from '@portabletext/editor'
import { createDocumentHandle, useDocumentProjection } from '@sanity/sdk-react'
import { Card } from '@sanity/ui'
import { Suspense } from 'react'

export const renderChild: RenderChildFunction = (props) => {
  if (props.schemaType.name === 'span') {
    return <>{props.children}</>
  } else if (
    ['track', 'course', 'lesson', 'article'].includes(props.schemaType.name)
  ) {
    return (
      <Suspense>
        <ReferenceChild {...props} />
      </Suspense>
    )
  }

  console.log(`unhandled child`, props)
  return <>{props.children}</>
}

type Projection = {
  title: string
}

function ReferenceChild(props: BlockChildRenderProps) {
  const documentId =
    '_ref' in props.value && typeof props.value._ref === 'string'
      ? props.value._ref
      : ''
  const documentType =
    '_type' in props.value && typeof props.value._type === 'string'
      ? props.value._type
      : ''
  const handle = createDocumentHandle({ documentId, documentType })
  const { data } = useDocumentProjection<Projection>({
    ...handle,
    projection: `{ title }`,
  })
  return (
    <Card paddingX={1} shadow={1} radius={2}>
      {data?.title || documentId}
    </Card>
  )
}
