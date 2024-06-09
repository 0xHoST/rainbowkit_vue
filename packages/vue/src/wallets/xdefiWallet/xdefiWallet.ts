import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const xdefiWallet = (): Wallet => {
  return {
    id: 'xdefi',
    name: 'XDEFI Wallet',
    rdns: 'io.xdefi',
    installed: hasInjectedProvider({ namespace: 'xfi.ethereum' }),
    iconUrl: (import.meta.glob<{ default: string }>('./xdefiWallet.svg',{ query: '?url',eager: true }))['./xdefiWallet.svg'].default,
    iconBackground: '#fff',
    downloadUrls: {
      chrome:
        'https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
      browserExtension: 'https://xdefi.io',
    },
    extensions: {
      instructions: {
        learnMoreUrl: 'https://xdefi.io/support-categories/xdefi-wallet/',
        steps: [
          {
            description: 'wallet_connectors.xdefi.extension.step1.description',
            step: 'install',
            title: 'wallet_connectors.xdefi.extension.step1.title',
          },
          {
            description: 'wallet_connectors.xdefi.extension.step2.description',
            step: 'create',
            title: 'wallet_connectors.xdefi.extension.step2.title',
          },
          {
            description: 'wallet_connectors.xdefi.extension.step3.description',
            step: 'refresh',
            title: 'wallet_connectors.xdefi.extension.step3.title',
          },
        ],
      },
    },
    createConnector: getInjectedConnector({ namespace: 'xfi.ethereum' }),
  };
};
