import type { PropsWithChildren } from 'react'
import { css, styled } from 'styled-components'
import { Card, type CardProps } from '@sanity/ui'

// Wrappers required because of bug with passing down "as" prop
// https://github.com/styled-components/styled-components/issues/2449

// Table
const TableWrapper = (props: CardProps = {}) => {
  return <Card as="table" {...props} />
}

const StyledTable = styled(TableWrapper)(
  () => css`
    display: table;
    width: 100%;
    border-collapse: collapse;

    &:not([hidden]) {
      display: table;
      border-collapse: collapse;
    }
  `,
)

type TableProps = PropsWithChildren<CardProps>

export function Table(props: TableProps) {
  const { children, ...rest } = props

  return <StyledTable {...rest}>{children}</StyledTable>
}

// Row
const RowWrapper = (
  props: CardProps & React.HTMLAttributes<HTMLTableRowElement> = {},
) => {
  return <Card as="tr" {...props} />
}

const StyledRow = styled(RowWrapper)(
  () => css`
    display: table-row;

    &:not([hidden]) {
      display: table-row;
    }
  `,
)

type TableRowProps = PropsWithChildren<
  CardProps &
    React.HTMLAttributes<HTMLTableRowElement> & {
      ref?: React.Ref<HTMLTableRowElement>
    }
>

export function Row(props: TableRowProps) {
  const { children, ...rest } = props

  return <StyledRow {...rest}>{children}</StyledRow>
}

// Cell
const CellWrapper = (
  props: CardProps & React.HTMLAttributes<HTMLTableCellElement> = {},
) => {
  return <Card as="td" {...props} />
}

const StyledCell = styled(CellWrapper)(
  () => css`
    display: table-cell;

    &:not([hidden]) {
      display: table-cell;
    }
  `,
)

type TableCellProps = PropsWithChildren<
  CardProps &
    React.HTMLAttributes<HTMLTableCellElement> & {
      colSpan?: number
      rowSpan?: number
    }
>

export function Cell(props: TableCellProps) {
  const { children, ...rest } = props

  return <StyledCell {...rest}>{children}</StyledCell>
}
