import type { App, Plugin } from 'vue'
import type { RainbowKitPluginOptions } from '@/types'
import { useRainbowKitPlugin } from '@/composables/plugin';

export const RainbowKitVuePlugin: Plugin = {
  install(app: App, options: RainbowKitPluginOptions) {
    useRainbowKitPlugin().install(app,options);
  }
} 