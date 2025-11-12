import { useSearchParams } from 'react-router'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { BlockRenderProps } from '@portabletext/editor'
import { Box, Card, Heading } from '@sanity/ui'

import { BlockHighlight } from './block-highlight'
import { urlFor } from '../../helpers/urlFor'

import 'codemirror/lib/codemirror.css'

export function renderBlock(props: BlockRenderProps) {
  const [searchParams] = useSearchParams()
  const highlightedBlockKey = searchParams.get('highlighted-block')
  const highlightedText = searchParams.get('highlighted-text')

  let Block

  if (props.style === 'h2') {
    Block = (
      <Box marginTop={6} marginBottom={4}>
        <Heading size={3}>{props.children}</Heading>
      </Box>
    )
  } else if (props.style === 'h3') {
    Block = (
      <Box marginTop={6} marginBottom={4}>
        <Heading size={2}>{props.children}</Heading>
      </Box>
    )
  } else if (props.style === 'h4') {
    Block = (
      <Box marginTop={6} marginBottom={4}>
        <Heading size={1}>{props.children}</Heading>
      </Box>
    )
  } else if (props.style === 'blockquote') {
    Block = <blockquote>{props.children}</blockquote>
  } else if (props.style === 'lead') {
    Block = (
      <div
        style={{
          fontSize: '1.25rem',
          fontFamily: 'sans-serif',
          lineHeight: '1.7',
          margin: '1rem 0',
        }}
      >
        {props.children}
      </div>
    )
  } else if (props.style === 'normal') {
    Block = (
      <div
        style={{
          fontFamily: 'sans-serif',
          lineHeight: '1.7',
          margin: '1rem 0',
        }}
      >
        {props.children}
      </div>
    )
  }

  if (props.schemaType.name === 'code') {
    const { language, code } = props.value as {
      language?: string
      code?: string
    }
    Block = code ? <BlockCode code={code} language={language} /> : null
  } else if (props.schemaType.name === 'image') {
    Block = <BlockImage {...props} />
  }

  if (Block) {
    // Check if this block should be highlighted with the new block highlighting
    const shouldHighlightBlock =
      highlightedBlockKey === props.value._key && highlightedText

    return shouldHighlightBlock ? (
      <BlockHighlight>{Block}</BlockHighlight>
    ) : (
      Block
    )
  }

  console.log(`unhandled block`, props)
  return <div>{JSON.stringify(props.schemaType.name)}</div>
}

function BlockImage(props: BlockRenderProps) {
  return (
    <img
      style={{ width: '100%', height: 'auto' }}
      src={urlFor(props.value).width(1200).url()}
      alt=""
    />
  )
}

type BlockCodeProps = {
  code: string
  language?: string
}

function BlockCode(props: BlockCodeProps) {
  return (
    <Card border>
      <CodeMirror
        value={props.code}
        options={{ mode: props.language ?? '', theme: 'material' }}
      />
    </Card>
  )
}
