import { PropsWithChildren } from 'react'

export function BlockHighlight({ children }: PropsWithChildren) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          // backgroundColor: 'var(--card-badge-suggest-bg-color)',
          border: '1px dashed var(--card-badge-suggest-fg-color)',
          top: -6,
          bottom: -6,
          left: -12,
          right: -12,
          position: 'absolute',
          borderRadius: '0.375rem',
          opacity: 0.5,
        }}
      />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}
