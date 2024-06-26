import type { ResetCssStyleType } from '../types'
import { style } from '@vanilla-extract/css'

export const base = style({
  border: 0,
  boxSizing: 'border-box',
  fontSize: '100%',
  lineHeight: 'normal',
  margin: 0,
  padding: 0,
  textAlign: 'left',
  verticalAlign: 'baseline',
  WebkitTapHighlightColor: 'transparent'
})

const list = style({
  listStyle: 'none'
})

const quote = style({
  quotes: 'none',
  selectors: {
    '&:before, &:after': {
      content: "''"
    }
  }
})

const table = style({
  borderCollapse: 'collapse',
  borderSpacing: 0
})

const appearance = style({
  appearance: 'none'
})

// biome-ignore format: design system keys
const field = style([
  appearance,
  {
    '::placeholder': {
      opacity: 1
    },
    outline: 'none'
  }
])

const mark = style({
  backgroundColor: 'transparent',
  color: 'inherit'
})

const select = style([
  field,
  {
    ':disabled': {
      opacity: 1
    },
    selectors: {
      '&::-ms-expand': {
        display: 'none'
      }
    }
  }
])

const input = style([
  field,
  {
    selectors: {
      '&::-ms-clear': {
        display: 'none'
      },
      '&::-webkit-search-cancel-button': {
        WebkitAppearance: 'none'
      }
    }
  }
])

const button = style({
  background: 'none',
  cursor: 'pointer',
  textAlign: 'left'
})

const a = style({
  color: 'inherit',
  textDecoration: 'none'
})

export const reset: ResetCssStyleType = {
  a: a,
  input: input,
  mark: mark,
  ol: list,
  ul: list,
  select: select,
  button: button,
  blockquote: quote,
  quote: quote,
  table: table,
  textArea: field
}
