import { useEffect, useState } from 'react'
import {
  EditorProvider,
  EditorSelection,
  PortableTextEditable,
  RangeDecoration,
  useEditor,
} from '@portabletext/editor'
import { SDKValuePlugin } from '@portabletext/plugin-sdk-value'
import { useSearchParams } from 'react-router'

import { RangeHighlight } from './range-highlight'
import { renderAnnotation } from './render-annotation'
import { renderBlock } from './render-block'
import { renderChild } from './render-child'
import { renderDecorator } from './render-decorator'
import { renderListItem } from './render-list-item'
import { schemaDefinition } from './schema'

type PortableTextEditorProps = {
  documentId: string
  documentType: string
  path: string
}

// Component that creates range decorations based on URL params
function RangeDecorationsProvider({
  children,
}: {
  children: (rangeDecorations: RangeDecoration[]) => React.ReactNode
}) {
  const editor = useEditor()
  const [searchParams] = useSearchParams()
  const [rangeDecorations, setRangeDecorations] = useState<RangeDecoration[]>(
    [],
  )

  const highlightedBlockKey = searchParams.get('highlighted-block')
  const highlightedText = searchParams.get('highlighted-text')

  useEffect(() => {
    const decorations: RangeDecoration[] = []

    // Only create text-level highlighting if we have both block key and text
    if (highlightedBlockKey && highlightedText) {
      // Find the text within the block and create a precise selection
      const value = editor.getSnapshot().context.value
      const block = value?.find((b) => b._key === highlightedBlockKey)

      if (block && 'children' in block && Array.isArray(block.children)) {
        // Find the text span that contains our target text
        const textSpan = block.children.find(
          (child: any) =>
            'text' in child &&
            typeof child.text === 'string' &&
            child.text.includes(highlightedText),
        )

        if (
          textSpan &&
          'text' in textSpan &&
          typeof textSpan.text === 'string'
        ) {
          const textStart = textSpan.text.indexOf(highlightedText)
          const textEnd = textStart + highlightedText.length

          const selection: EditorSelection = {
            anchor: {
              path: [
                { _key: highlightedBlockKey },
                'children',
                { _key: textSpan._key },
              ],
              offset: textStart,
            },
            focus: {
              path: [
                { _key: highlightedBlockKey },
                'children',
                { _key: textSpan._key },
              ],
              offset: textEnd,
            },
          }

          decorations.push({
            selection,
            component: RangeHighlight,
            payload: {
              blockKey: highlightedBlockKey,
              text: highlightedText,
              type: 'text',
            },
          })
        }
      }
    }

    setRangeDecorations(decorations)
  }, [editor, highlightedBlockKey, highlightedText])

  return <>{children(rangeDecorations)}</>
}

export function PortableTextEditor({
  documentId,
  documentType,
  path,
}: PortableTextEditorProps) {
  return (
    <>
      <EditorProvider
        initialConfig={{
          schemaDefinition,
        }}
      >
        <RangeDecorationsProvider>
          {(rangeDecorations) => (
            <PortableTextEditable
              renderBlock={renderBlock}
              renderListItem={renderListItem}
              renderDecorator={renderDecorator}
              renderAnnotation={renderAnnotation}
              rangeDecorations={rangeDecorations}
              renderChild={renderChild}
              style={{ outline: '1px solid transparent' }}
            />
          )}
        </RangeDecorationsProvider>
        <SDKValuePlugin
          documentId={documentId}
          documentType={documentType}
          path={path}
        />
      </EditorProvider>
    </>
  )
}
