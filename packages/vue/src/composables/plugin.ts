import {
  type RainbowKitPluginOptions,
  type WalletList,
  type ThemeOption,
  RainbowKitConfigContextKey,
  AppContextKey,
  WalletButtonContextKey,
  ThemeContextKey,
  ModalSizeContextKey,
  ShowBalanceContextKey,
  LocaleAdapterContextKey,
  ShowRecentTransactionsContextKey,
  ModalContextKey,
  CoolModeContextKey,
  AvatarComponentContextKey,
  RainbowKitChainContextKey,
  TransactionStoreContextKey,
  AuthenticationConfigContextKey,
  ModalSize,
  Chains,
  Transports,
  WalletConnectStoreContextKey,
} from '../types';
import { createRainbowKitChainContext } from "@/composables/chain"
import { createApplicationInfoContext} from "@/composables/application"
import { createAuthenticationConfigContext } from "@/composables/authentication"
import { createRainbowKitBalanceContext} from "@/composables/balance"
import { createThemeContext} from "@/composables/theme";
import { createWalletButtonContext } from "@/composables/button"
import { createModalContext, createModalSizeContext } from "@/composables/modal"
import { createLocaleContext } from "@/composables/locale"
import { createShowRecentTransactionContext, createTransactionStoreContext } from "@/composables/transaction";
import { createAvatarContext } from "@/composables/avatar";
import { createCoolModeContext } from "@/composables/mode"
import { computeWalletConnectMetadata, getConnectors, fetchTranslations, mergeDeep } from '@/utils'
import { RainbowKitProvider } from '@/components/Common/RainbowKitProvider'
import { WalletButton } from "@/components/Buttons/WalletButton";
import { ConnectButton } from "@/components/Buttons/ConnectButton";
import { getLightTheme, getDarkTheme, getMidnightTheme } from '@/css'
import { metaMaskWallet, coinbaseWallet, ledgerWallet, rainbowWallet, safeWallet, braveWallet } from '@/wallets'
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import { http } from 'viem'
import { WagmiPlugin, createConfig, createStorage } from '@wagmi/vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { defineComponent, h, type App } from 'vue'
import { createWalletConnectStoreContext } from './wallet.connect';

function createDefaultTransport(chains: Chains): Transports {
  const newTransports: Transports = {} as Transports;
  for (const chain of chains) {
    newTransports[chain.id] = http()
  }
  return newTransports;
}

export const StyleComponent = defineComponent({
  props: {
    themeId: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    return () => h('div', { [props.themeId]: true }, h('style', slots.default ? slots.default() : undefined));
  },
});

export function getDefaultPluginOptions(chains: Chains):
  Omit<RainbowKitPluginOptions, 'appName' | 'projectId'> {
  const defaultModalSize: ModalSize = 'wide';
  const defaultTheme: ThemeOption = {
    theme: { 
      light: getLightTheme(), 
      dark: getDarkTheme(), 
      midnight: getMidnightTheme() 
    },
    mode: 'light'
  };
  const defaultTransport = createDefaultTransport(chains)
  const defaultLearnMoreUrl = "https://learn.rainbow.me/understanding-web3?utm_source=rainbowkit&utm_campaign=learnmore";
  const defaultWallets: WalletList = [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        coinbaseWallet.all,
        ledgerWallet,
        rainbowWallet,
        safeWallet,
        braveWallet,
      ]
    }
  ]

  const showBalance = true;
  const coolMode = true;
  const showRecentTransactions = true;

  return {
    enableChainModalOnConnect: true,
    connectModalTeleportTarget: 'body', 
    chainModalTeleportTarget: 'body', 
    accountModalTeleportTarget: 'body', 
    ssr: true,
    storage: createStorage({ storage: localStorage, key: 'rk-vue' }),
    theme: defaultTheme,
    learnMoreUrl: defaultLearnMoreUrl,
    wallets: defaultWallets,
    modalSize: defaultModalSize,
    transports: defaultTransport,
    chains,
    showBalance,
    coolMode,
    showRecentTransactions,
  };
}

export function computeRainbowKitPluginOptions(options: RainbowKitPluginOptions) {
  const { appName, appDescription, appIcon, appUrl, projectId, wallets } = options;
  const metadata = computeWalletConnectMetadata({ appName, appDescription, appIcon, appUrl })
  const connectors = wallets ? getConnectors(wallets, {
    projectId,
    appName,
    appDescription,
    appIcon,
    appUrl,
    walletConnectParameters: { metadata }
  }) : undefined;

  return {
    connectors,
    ...options
  };
}

export function useRainbowKitPlugin() {

  function configureDirective(app: App) {
    app.directive("scroll-lock", {
      mounted: (el, binding) => {
        if (binding.value) {
          disableBodyScroll(el);
        }

      },
      updated: (el, binding) => {
        if (binding.value) {
          disableBodyScroll(el);
        } else {
          enableBodyScroll(el);
        }
      },
      unmounted: (el, _) => {
        enableBodyScroll(el);
      }
    });
  }

  function configureWagmi(app: App,
    option: RainbowKitPluginOptions) {

    const {
      appName,
      appDescription,
      appUrl,
      appIcon,
      wallets,
      projectId,
      auth,
      locale,
      theme,
      coolMode,
      showRecentTransactions,
      enableChainModalOnConnect: ignoreChainModalOnConnect,
      connectModalTeleportTarget, 
      chainModalTeleportTarget, 
      accountModalTeleportTarget, 
      currencyAddress,
      initialChainId,
      avatar,
      connectModalIntro,
      modalSize,
      connectors,
      chains,
      transports,
      learnMoreUrl,
      showBalance,
      disclaimer,
      storage,
      ...wagmiParameters
    } = computeRainbowKitPluginOptions(option);
    if (connectors && transports) {
      const config = createConfig({
        connectors,
        chains,
        transports,
        storage,
        ...wagmiParameters
      });
      app.use(WagmiPlugin, { config });
      app.use(VueQueryPlugin, {});
    }
  }

  function registerGlobalComponent(app: App) {
    app.component('RainbowKitProvider', RainbowKitProvider);
    app.component('WalletButton', WalletButton);
    app.component('ConnectButton', ConnectButton);
    app.component('StyleComponent', StyleComponent);
  }

  function configurePluginOptions(app: App, option: RainbowKitPluginOptions) {
    app.provide(RainbowKitConfigContextKey, option);
    app.provide(ModalSizeContextKey, createModalSizeContext(option));
    app.provide(AppContextKey, createApplicationInfoContext(option));
    app.provide(ShowBalanceContextKey, createRainbowKitBalanceContext(option));
    app.provide(LocaleAdapterContextKey, createLocaleContext(option));
    app.provide(ShowRecentTransactionsContextKey, createShowRecentTransactionContext(option));
    app.provide(AuthenticationConfigContextKey, createAuthenticationConfigContext(option));
    app.provide(ThemeContextKey, createThemeContext(option));
    app.provide(ModalContextKey, createModalContext(option));
    app.provide(AvatarComponentContextKey, createAvatarContext(option));
    app.provide(RainbowKitChainContextKey, createRainbowKitChainContext(option));
    app.provide(CoolModeContextKey, createCoolModeContext(option));
    app.provide(WalletConnectStoreContextKey,createWalletConnectStoreContext());
    app.provide(TransactionStoreContextKey,createTransactionStoreContext());
    app.provide(WalletButtonContextKey, createWalletButtonContext());
  }

  function install(app: App, option: RainbowKitPluginOptions) {
    const newOptions = mergeDeep(getDefaultPluginOptions(option.chains),option) as RainbowKitPluginOptions;
    configureDirective(app);
    configurePluginOptions(app, newOptions);
    configureWagmi(app, newOptions);
    registerGlobalComponent(app);
  }

  return { install };
}
