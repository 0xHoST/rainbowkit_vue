import type { Chain } from "@wagmi/vue/chains";
import { ComputedRef, ToRef, UnwrapRef } from "vue";

export type RainbowKitChainMetadata = {
    iconUrl?: string;
    iconBackground?: string;
}
export interface RainbowKitChain extends Chain {
    iconUrl?: string;
    iconBackground?: string;
}
export interface RainbowKitChainContext{
    rainbowKitChains?: Array<RainbowKitChain>;
    initialChainId?: number;
    ignoreChainModalOnConnect?: boolean,
}
export type UseRainbowKitChainContextReturnType = {
    [K in keyof RainbowKitChainContext]: ToRef<UnwrapRef<RainbowKitChainContext[K]>>
} & { chainByIds: ComputedRef<Record<number,RainbowKitChain>> }
