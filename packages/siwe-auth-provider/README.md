# Rainbowkit Vue Siwe Auth Provider

An auth adapter for rainbowkit vue plugin.

## Installation

Install auth adapter and its [rainbowkit vue](https://github.com/0xHoST/rainbowkit_vue.git), [viem](https://viem.sh) and [vue-auth3](https://github.com/tachibana-shin/vue-auth3) peer dependencies.

```bash
npm install viem vue-auth3 use-rainbowkit-vue use-rainbowkit-vue-siwe-auth-provider
```

## Usage

```ts
import { RainbowKitVuePlugin  } from "use-rainbowkit-vue";
import { RainbowKitVueSiweAuthAdapterPlugin } from 'use-rainbowkit-vue-siwe-auth-provider';
const { create: createAuthAdapter } = RainbowKitVueSiweAuthAdapterPlugin();
const authAdapter = createAuthAdapter(app);
app.use(RainbowKitVuePlugin,{
    allowAuthenticate: true,
    authenticateAdapter: authAdapter,
})
```
