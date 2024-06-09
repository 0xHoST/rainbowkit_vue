# Rainbowkit Vue i18n Locale Provider

An locale adapter for rainbowkit vue plugin.

## Installation

Install locale adapter and its [rainbowkit-vue](https://github.com/0xHoST/rainbowkit_vue.git), [vue-i18n](https://github.com/kazupon/vue-i18n) peer dependencies.

```bash
npm install vue-i18n use-rainbowkit-vue use-rainbowkit-vue-i18n-locale-provider
```

## Usage

```ts
import { RainbowKitVuePlugin  } from "use-rainbowkit-vue";
import { RainbowKitVueI18nLocaleAdapterPlugin } from 'use-rainbowkit-vue-i18n-locale-provider';
const { create: createI18nAdapter } = RainbowKitVueI18nLocaleAdapterPlugin();
const i18nAdapter = createI18nAdapter(app,{ currentLocale: 'zh', fallbackLocale: 'zh' });
app.use(RainbowKitVuePlugin,{
    locale: 'zh',
    fallbackLocale: 'zh',
    adapter: i18nAdapter
})
```
