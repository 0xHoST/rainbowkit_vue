import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const zealWallet = (): Wallet => ({
  id: 'zeal',
  name: 'Zeal',
  iconUrl: (import.meta.glob<{ default: string }>('./zealWallet.svg',{ query: '?url',eager: true }))['./zealWallet.svg'].default,
  iconBackground: '#fff0',
  installed: hasInjectedProvider({ flag: 'isZeal' }),
  downloadUrls: {
    browserExtension: 'https://zeal.app',
  },
  extensions: {
    instructions: {
      learnMoreUrl: 'https://zeal.app/',
      steps: [
        {
          description: 'wallet_connectors.zeal.extension.step1.description',
          step: 'install',
          title: 'wallet_connectors.zeal.extension.step1.title',
        },
        {
          description: 'wallet_connectors.zeal.extension.step2.description',
          step: 'create',
          title: 'wallet_connectors.zeal.extension.step2.title',
        },
        {
          description: 'wallet_connectors.zeal.extension.step3.description',
          step: 'refresh',
          title: 'wallet_connectors.zeal.extension.step3.title',
        },
      ],
    },
  },
  createConnector: getInjectedConnector({ flag: 'isZeal' }),
});
