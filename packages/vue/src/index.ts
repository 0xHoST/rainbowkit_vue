import './utils/array.extension';

///plugins
export { RainbowKitVuePlugin } from "./RainbowKitVuePlugin";

///locale adapter
export { createRainbowKitDefaultAdapter } from "./locales/adapters/RainbowkitDefaultAdapter";

//types
export {
    RainbowKitConfigContextKey,
    AppContextKey,
    WalletButtonContextKey,
    ThemeContextKey,
    ModalSizeContextKey,
    ModalSizeOptions,
    ShowBalanceContextKey,
    LocaleAdapterContextKey,
    ShowRecentTransactionsContextKey,
    ModalContextKey,
    CoolModeContextKey,
    AvatarComponentContextKey,
    AuthenticationConfigContextKey,
    RainbowKitChainContextKey, 
    TransactionStoreContextKey,
} from "./types"
export type { 
    RainbowKitPluginOptions,
    RainbowKitPluginConfig,
    WagmiConfigParameters,
    Wallet,
    WalletList,
    WalletDetailsParams,
    RainbowKitWalletConnectParameters,
    Theme,
    AuthenticationStatus,
    AuthenticationConfig,
    LocaleAdapter,
    LocaleAdapterInstance,
    LocaleAdapterNumberTranslationFunc,
    LocaleAdapterTextTranslationFunc,
    LocaleMixedType,
    LocaleMessages,
    AvatarComponentSetupFn,
    DisclaimerComponentSetupFn,
    AuthenticationAdapter,
    RainbowKitChain,
    DisclaimerLinkProps,
    Locale,
    ModalContext,
    ModalSize,
    AppInfoContext,
    RainbowKitChains
} from "./types"

///themes
export { getLightTheme, getDarkTheme, getMidnightTheme } from "./css"

///composables
export { 
    useLocale, 
    useModalContext,  
    useModalSizeContext,  
    useAppContext, 
    useWalletButtonContext,  
    useThemeContext,  
    useRainbowKitBalance, 
    useShowRecentTransactionContext, 
    useTransactionStoreContext,
    useAuthenticationConfigContext,
    useCoolModeContext,
    useAddRecentTransasction,
    useClearRecentTransactions,
    useRainbowKitAccountContext,
    useRainbowKitChainContext  
} from "./composables"

///components
export { 
    RainbowKitProvider,
    WalletButton,
    ConnectButton,
    DisclaimerText,
    DisclaimerLink,
} from "./components"

export type {
    ConnectModalIntroComponentSetupFn
} from "./components";

///wallets
export {
  argentWallet,
  bifrostWallet,
  bitgetWallet,
  bitskiWallet,
  bloomWallet,
  braveWallet,
  clvWallet,
  coin98Wallet,
  coinbaseWallet,
  coreWallet,
  dawnWallet,
  desigWallet,
  enkryptWallet,
  foxWallet,
  frameWallet,
  frontierWallet,
  imTokenWallet,
  injectedWallet,
  kresusWallet,
  ledgerWallet,
  metaMaskWallet,
  mewWallet,
  oktoWallet,
  okxWallet,
  omniWallet,
  oneKeyWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  ramperWallet,
  roninWallet,
  safeWallet,
  safeheronWallet,
  safepalWallet,
  subWallet,
  tahoWallet,
  talismanWallet,
  tokenaryWallet,
  tokenPocketWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
  xdefiWallet,
  zealWallet,
  zerionWallet,
} from "./wallets";

export { http } from "@wagmi/vue";
export * from "@wagmi/vue/chains";
export * from "@wagmi/vue/connectors";