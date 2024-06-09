import {
  AvatarComponentContextKey,
  type AvatarComponentSetupFn,
  type Context,
  type RainbowKitPluginOptions,
} from '@/types'
import { inject, shallowRef } from 'vue'

export function createAvatarContext(option: RainbowKitPluginOptions): Context<AvatarComponentSetupFn | undefined> {
  const context = shallowRef<AvatarComponentSetupFn | undefined>(option.avatar)
  return context;
}

export function useAvatarContext(){
  const context = inject(AvatarComponentContextKey);
  if (!context) throw Error(`Could not find injected '${String(AvatarComponentContextKey)}' instance.`)
  return context;
}
