import type { InjectionKey, Ref, ToRef, UnwrapRef } from 'vue'
import type { AvatarComponentSetupFn } from "@/types/components/AccountModal/avatar";
import type { LocaleAdapterInstance } from "@/types/composables/locale";
import type { ModalContext, ModalSize } from "@/types/composables/modal";
import type { RainbowKitChainContext } from "@/types/composables/chain";
import type { ThemeOption } from "@/types/css/theme.css.type";
import type { RainbowKitPluginOptions } from "@/types/composables/rainbowkit";
import type { TransactionStoreContext } from "@/types/composables/transaction";
import type { WalletConnector } from "@/types/composables/wallet";
import type { AuthenticationConfig } from "@/types/composables/account";
import type { ResponsiveValue } from '@/css'
import { ConnectModalIntroComponentSetupFn } from '@/components'
import { DisclaimerComponentSetupFn } from '@/types/components/Others/disclaimer';
import { Address } from 'viem';

export type WalletButtonContext = {
  connector: WalletConnector | null
}

export type AppInfoContext = {
  name?: string
  disclaimer?: DisclaimerComponentSetupFn,
  learnMoreUrl?: string
  connectModalTeleportTarget?: string
  chainModalTeleportTarget?:string
  accountModalTeleportTarget?:string,
  connectModalIntro?: ConnectModalIntroComponentSetupFn
}

export type UseAppContextReturnType = {
  [K in keyof AppInfoContext]: ToRef<UnwrapRef<AppInfoContext[K]>>
};

export type ShowBalanceContext = {
  showBalance: ResponsiveValue<boolean> | undefined,
  currencyAddress?: Address
}

export type Context<T> = Ref<UnwrapRef<T>>

export const ModalSizeContextKey: InjectionKey<Context<ModalSize>> = Symbol.for('rk-modal-size-context');
export const ModalContextKey: InjectionKey<Context<ModalContext>> = Symbol.for('rk-modal-context');
export const WalletButtonContextKey: InjectionKey<Context<WalletButtonContext>> = Symbol.for('rk-wallet-connect-context');
export const AppContextKey: InjectionKey<Context<AppInfoContext>> = Symbol.for('rk-app-info-context');
export const ShowBalanceContextKey: InjectionKey<Context<ShowBalanceContext>> = Symbol.for('rk-show-balance-context');
export const ShowRecentTransactionsContextKey: InjectionKey<Context<boolean>> = Symbol.for('rk-show-recent-transaction-context')
export const TransactionStoreContextKey: InjectionKey<Context<TransactionStoreContext>> = Symbol.for('rk-transaction-store-context');
export const CoolModeContextKey: InjectionKey<Context<boolean>> = Symbol.for('rk-coolmode-context')
export const RainbowKitChainContextKey: InjectionKey<Context<RainbowKitChainContext>> = Symbol.for('rk-chain-context')
export const ThemeContextKey: InjectionKey<Context<ThemeOption>> = Symbol.for('rk-theme-context')
export const AuthenticationConfigContextKey: InjectionKey<Context<AuthenticationConfig>> = Symbol.for('rk-authentication-config-context')
export const LocaleAdapterContextKey: InjectionKey<Context<LocaleAdapterInstance>> = Symbol.for('rk-locale-adapter-context')
export const AvatarComponentContextKey: InjectionKey<Context<AvatarComponentSetupFn | undefined>> = Symbol.for('rk-avatar-context')
export const RainbowKitConfigContextKey: InjectionKey<RainbowKitPluginOptions> = Symbol.for('rk-config-context')
