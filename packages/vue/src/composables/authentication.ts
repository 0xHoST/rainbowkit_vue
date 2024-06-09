import { AuthenticationConfig, AuthenticationConfigContextKey, Context, RainbowKitPluginOptions } from "@/types";
import { inject, ref, toRefs,reactive } from "vue";

export function createAuthenticationConfigContext(
    option: RainbowKitPluginOptions,
  ): Context<AuthenticationConfig> {
    const { allowAuthenticate, authenticateAdapter } = option
    const context = ref<AuthenticationConfig>({
      adapter: allowAuthenticate ? authenticateAdapter : undefined,
    })
    return context;
}
  
export function useAuthenticationConfigContext(){
    const context = inject(AuthenticationConfigContextKey)
    if (!context) throw Error(`Could not find injected '${String(AuthenticationConfigContextKey)}' instance.`);
    return toRefs(reactive(context.value));
}