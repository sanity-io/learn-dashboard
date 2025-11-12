import { PropsWithChildren } from 'react'

export function RangeHighlight({ children }: PropsWithChildren) {
  return (
    <span style={{ position: 'relative' }}>
      <span
        style={{
          backgroundColor: 'var(--card-badge-suggest-bg-color)',
          border: '1px dashed var(--card-badge-suggest-fg-color)',
          top: -3,
          bottom: -3,
          left: -4,
          right: -4,
          position: 'absolute',
          borderRadius: '0.375rem',
          opacity: 0.5,
        }}
      />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  )
}
