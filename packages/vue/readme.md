# Rainbowkit Vue Plugin

A vue plugin for rainbowkit. (Not official)
Based on [@wagmi/vue](https://github.com/wevm/wagmi)

## Installation

Install rainbowkit-vue and its [wagmi vue](https://github.com/wevm/wagmi), [viem](https://viem.sh) peer dependencies.

```bash
npm install @wagmi/vue viem @tanstack/vue-query use-rainbowkit-vue 
```

## Setup

If found error such as buffer not defined or any node module not defined, install or setup polyfill.

```ts
import { createApp } from 'vue'
import 'use-rainbowkit-vue/style.css';

createApp(App).use(RainbowKitVuePlugin,{ appName: 'RainbowKit demo' })
```

## Use of Composition API with `<script setup>`

```vue
<script lang="ts" setup>
import { RainbowKitProvider, ConnectButton } from "use-rainbowkit-vue";
</script>
<template>
    <div class="content">
        <RainbowKitProvider>
            <ConnectButton />
        </RainbowKitProvider>
    </div>
</template>
```

## Credits

- [wagmi.sh](https://wagmi.sh/)
- [RainbowKit](https://www.rainbowkit.com/)

## License

Licensed under the [MIT](https://opensource.org/license/MIT) License.
