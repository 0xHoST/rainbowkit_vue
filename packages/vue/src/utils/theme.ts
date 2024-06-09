import { assignInlineVars } from '@vanilla-extract/dynamic'
import { themeVars, type ThemeVariables } from '@/css/sprinkles.css'

const resolveThemeVars = (theme: ThemeVariables | (() => ThemeVariables)) =>
  typeof theme === 'function' ? theme() : theme

export function cssObjectFromTheme(
  theme: ThemeVariables | (() => ThemeVariables),
  { extends: baseTheme }: { extends?: ThemeVariables | (() => ThemeVariables) } = {}
): Record<string, string> {

  
  const resolvedThemeVars = {
    // We use an object spread here to ensure it's a plain object since vanilla-extract's
    // var objects have a custom 'toString' method that returns a CSS string, but we don't
    // want to leak this to our consumers since they're unaware we're using vanilla-extract.
    // Instead, we want them to handle this explicitly via our 'cssStringFromTheme' function.
    ...assignInlineVars(themeVars, resolveThemeVars(theme))
  }

  if (!baseTheme) {
    return resolvedThemeVars
  }

  const resolvedBaseThemeVars = assignInlineVars(themeVars, resolveThemeVars(baseTheme))

  const filteredVars = Object.fromEntries(
    Object.entries(resolvedThemeVars).filter(
      ([varName, value]) => value !== resolvedBaseThemeVars[varName]
    )
  )

  return filteredVars as Record<string, string>
}

export function cssStringFromTheme(
  theme: ThemeVariables | (() => ThemeVariables),
  options: { extends?: ThemeVariables | (() => ThemeVariables) } = {}
) {
  return Object.entries(cssObjectFromTheme(theme, options))
    .map(([key, value]) => `${key}:${value.replace(/[:;{}</>]/g, '')};`)
    .join('')
}
