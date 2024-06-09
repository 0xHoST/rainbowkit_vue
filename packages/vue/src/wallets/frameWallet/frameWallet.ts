import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const frameWallet = (): Wallet => ({
  id: 'frame',
  name: 'Frame',
  installed: hasInjectedProvider({ flag: 'isFrame' }),
  iconUrl: (import.meta.glob<{ default: string }>('./frameWallet.svg',{ query: '?url',eager: true }))['./frameWallet.svg'].default,
  iconBackground: '#121C20',
  downloadUrls: {
    browserExtension: 'https://frame.sh/',
  },
  extensions: {
    instructions: {
      learnMoreUrl:
        'https://docs.frame.sh/docs/Getting%20Started/Installation/',
      steps: [
        {
          description: 'wallet_connectors.frame.extension.step1.description',
          step: 'install',
          title: 'wallet_connectors.frame.extension.step1.title',
        },
        {
          description: 'wallet_connectors.frame.extension.step2.description',
          step: 'create',
          title: 'wallet_connectors.frame.extension.step2.title',
        },
        {
          description: 'wallet_connectors.frame.extension.step3.description',
          step: 'refresh',
          title: 'wallet_connectors.frame.extension.step3.title',
        },
      ],
    },
  },
  createConnector: getInjectedConnector({ flag: 'isFrame' }),
});
