import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const safeheronWallet = (): Wallet => ({
  id: 'safeheron',
  name: 'Safeheron',
  installed: hasInjectedProvider({
    namespace: 'safeheron',
    flag: 'isSafeheron',
  }),
  iconUrl: (import.meta.glob<{ default: string }>('./safeheronWallet.svg',{ query: '?url',eager: true }))['./safeheronWallet.svg'].default,
  iconBackground: '#fff',
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/safeheron/aiaghdjafpiofpainifbgfgjfpclngoh',
    browserExtension: 'https://www.safeheron.com/',
  },
  extensions: {
    instructions: {
      learnMoreUrl: 'https://www.safeheron.com/',
      steps: [
        {
          description:
            'wallet_connectors.safeheron.extension.step1.description',
          step: 'install',
          title: 'wallet_connectors.safeheron.extension.step1.title',
        },
        {
          description:
            'wallet_connectors.safeheron.extension.step2.description',
          step: 'create',
          title: 'wallet_connectors.safeheron.extension.step2.title',
        },
        {
          description:
            'wallet_connectors.safeheron.extension.step3.description',
          step: 'refresh',
          title: 'wallet_connectors.safeheron.extension.step3.title',
        },
      ],
    },
  },
  createConnector: getInjectedConnector({
    namespace: 'safeheron',
    flag: 'isSafeheron',
  }),
});
