import { createRainbowKitDefaultAdapter } from '@/locales/adapters/RainbowkitDefaultAdapter'
import {
  LocaleAdapterContextKey,
  type Context,
  type LocaleAdapterInstance,
  type RainbowKitPluginConfig,
  type Locale,
  type LocaleOptions
} from '@/types'
import { detectedBrowserLocale } from '@/utils'
import { inject, reactive, ref, toRefs } from 'vue'

export function createLocaleContext(
  option: RainbowKitPluginConfig
): Context<LocaleAdapterInstance> {
  const newOptions: LocaleOptions = {
    locale: option.locale?.locale ?? detectedBrowserLocale() ?? 'en',
    fallbackLocale: option.locale?.fallbackLocale ?? 'en',
    message: option.locale?.message,
    adapter: option.locale?.adapter
  }
  const adapter = newOptions?.adapter ?? createRainbowKitDefaultAdapter().install(newOptions)
  const context = ref<LocaleAdapterInstance>(adapter)
  return context;
}

export function useLocale() {
  const adapter = inject(LocaleAdapterContextKey)
  if (!adapter)
    throw Error(`Could not find injected '${String(LocaleAdapterContextKey)}' instance.`)
  const { t: translate, currentLocale } = adapter.value

  const changeLocale = (locale: Locale) => {
    adapter.value.changeLocale(adapter,locale);
  }

  const t = (key: string, ...replacements: Record<string, any>[]) => {
    key = `${currentLocale}.${key}`
    const result = translate(adapter.value.fallbackLocale,adapter.value.currentLocale,adapter.value.messages,key, replacements)
    return result
  }

  return { t, changeLocale, adapter }
}
