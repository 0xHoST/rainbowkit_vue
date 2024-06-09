import { ThemeContextKey, type Context, type ThemeOption, type RainbowKitPluginOptions } from '@/types'
import { getLightTheme, getDarkTheme, getMidnightTheme } from '@/css'
import { cssStringFromTheme } from '@/utils'
import { inject, computed, ref, toRefs,reactive } from 'vue'

export function createThemeContext(option: RainbowKitPluginOptions): Context<ThemeOption> {
  const defaultTheme: ThemeOption = {
    theme: { light: getLightTheme(), dark: getDarkTheme(), midnight: getMidnightTheme() },
    mode: 'light'
  }
  const context = ref<ThemeOption>(option.theme ?? defaultTheme);
  return context;
}

export function useThemeContext() {
  const context = inject(ThemeContextKey);
  if (!context) throw Error(`Could not find injected '${String(ThemeContextKey)}' instance.`)
  
  const generateCssFromTheme = (themeOption?: ThemeOption) => {
    if (!themeOption) return;
    const selector = `[data-rk-vue]`;
    return `${selector}{${cssStringFromTheme(themeOption.theme[themeOption.mode])}}`;
  }

  const changeTheme = (mode: 'light' | 'dark' | 'midnight') => {
    context.value = {
      ...context.value,
      mode
    };
  }

  const css = computed<string | undefined>(() => generateCssFromTheme(context.value))
  return { ...toRefs(reactive(context.value)), css, changeTheme }
}
