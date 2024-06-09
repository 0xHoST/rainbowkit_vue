import { Wallet } from '@/types/composables/wallet';
import { getInjectedConnector, hasInjectedProvider } from '@/utils/wallet';

export const bitskiWallet = (): Wallet => ({
  id: 'bitski',
  name: 'Bitski',
  installed: hasInjectedProvider({ flag: 'isBitski' }),
  iconUrl:  (import.meta.glob<{ default: string }>('./bitskiWallet.svg',{ query: '?url',eager: true }))['./bitskiWallet.svg'].default,
  iconBackground: '#fff',
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/bitski/feejiigddaafeojfddjjlmfkabimkell',
    browserExtension: 'https://bitski.com',
  },
  extensions: {
    instructions: {
      learnMoreUrl:
        'https://bitski.zendesk.com/hc/articles/12803972818836-How-to-install-the-Bitski-browser-extension',
      steps: [
        {
          description: 'wallet_connectors.bitski.extension.step1.description',
          step: 'install',
          title: 'wallet_connectors.bitski.extension.step1.title',
        },
        {
          description: 'wallet_connectors.bitski.extension.step2.description',
          step: 'create',
          title: 'wallet_connectors.bitski.extension.step2.title',
        },
        {
          description: 'wallet_connectors.bitski.extension.step3.description',
          step: 'refresh',
          title: 'wallet_connectors.bitski.extension.step3.title',
        },
      ],
    },
  },
  createConnector: getInjectedConnector({ flag: 'isBitski' }),
});
