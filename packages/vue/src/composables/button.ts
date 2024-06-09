import { WalletButtonContextKey, type Context, type WalletButtonContext } from '@/types'
import { inject, ref, toRefs,reactive } from 'vue'

export function createWalletButtonContext(): Context<WalletButtonContext>{
    const context = ref<WalletButtonContext>({ connector: null });
    return context;
}

export function useWalletButtonContext() {
    const context = inject(WalletButtonContextKey);
    if (!context) throw Error(`Could not find injected '${String(WalletButtonContextKey)}' instance.`)
    return toRefs(reactive(context.value));
}