import {
  AppContextKey,
  UseAppContextReturnType,
  type AppInfoContext,
  type Context,
  type RainbowKitPluginOptions
} from '@/types'
import { inject, toRefs, shallowRef,reactive } from 'vue'

export function createApplicationInfoContext(
  option: RainbowKitPluginOptions
): Context<AppInfoContext> {
  const {
    appName, 
    disclaimer, 
    learnMoreUrl, 
    connectModalTeleportTarget, 
    chainModalTeleportTarget, 
    accountModalTeleportTarget, 
    connectModalIntro
  } = option
  const context = shallowRef<AppInfoContext>({
    name: appName,
    disclaimer: disclaimer,
    learnMoreUrl: learnMoreUrl ?? "https://learn.rainbow.me/understanding-web3?utm_source=rainbowkit&utm_campaign=learnmore",
    connectModalTeleportTarget,
    chainModalTeleportTarget,
    accountModalTeleportTarget,
    connectModalIntro: connectModalIntro
  })

  return context;
}

export function useAppContext() : UseAppContextReturnType {
  const context = inject(AppContextKey)
  if (!context) throw Error(`Could not find injected '${String(AppContextKey)}' instance.`);
  return { ...toRefs(reactive({  name: context.value.name, learnMoreUrl: context.value.learnMoreUrl })), 
    disclaimer: shallowRef(context.value.disclaimer), 
    connectModalIntro: shallowRef(context.value.connectModalIntro)
  }
}
