import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const rabbyWallet = (): Wallet => ({
  id: 'rabby',
  name: 'Rabby Wallet',
  iconUrl: (import.meta.glob<{ default: string }>('./rabbyWallet.svg',{ query: '?url',eager: true }))['./rabbyWallet.svg'].default,
  rdns: 'io.rabby',
  iconBackground: '#8697FF',
  installed: hasInjectedProvider({ flag: 'isRabby' }),
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
    browserExtension: 'https://rabby.io',
  },
  extensions: {
    instructions: {
      learnMoreUrl: 'https://rabby.io/',
      steps: [
        {
          description: 'wallet_connectors.rabby.extension.step1.description',
          step: 'install',
          title: 'wallet_connectors.rabby.extension.step1.title',
        },
        {
          description: 'wallet_connectors.rabby.extension.step2.description',
          step: 'create',
          title: 'wallet_connectors.rabby.extension.step2.title',
        },
        {
          description: 'wallet_connectors.rabby.extension.step3.description',
          step: 'refresh',
          title: 'wallet_connectors.rabby.extension.step3.title',
        },
      ],
    },
  },
  createConnector: getInjectedConnector({ flag: 'isRabby' }),
});
