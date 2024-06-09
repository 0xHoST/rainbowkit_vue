import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const talismanWallet = (): Wallet => ({
  id: 'talisman',
  name: 'Talisman',
  rdns: 'xyz.talisman',
  iconUrl: (import.meta.glob<{ default: string }>('./talismanWallet.svg',{ query: '?url',eager: true }))['./talismanWallet.svg'].default,
  iconBackground: '#fff',
  installed: hasInjectedProvider({
    namespace: 'talismanEth',
    flag: 'isTalisman',
  }),
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    firefox:
      'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/',
    browserExtension: 'https://talisman.xyz/download',
  },
  extensions: {
    instructions: {
      learnMoreUrl: 'https://talisman.xyz/',
      steps: [
        {
          description: 'wallet_connectors.talisman.extension.step1.description',
          step: 'install',
          title: 'wallet_connectors.talisman.extension.step1.title',
        },
        {
          description: 'wallet_connectors.talisman.extension.step2.description',
          step: 'create',
          title: 'wallet_connectors.talisman.extension.step2.title',
        },
        {
          description: 'wallet_connectors.talisman.extension.step3.description',
          step: 'refresh',
          title: 'wallet_connectors.talisman.extension.step3.title',
        },
      ],
    },
  },
  createConnector: getInjectedConnector({
    namespace: 'talismanEth',
    flag: 'isTalisman',
  }),
});
