import { isSafari } from '@/utils/browser';
import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const tokenaryWallet = (): Wallet => ({
  id: 'tokenary',
  name: 'Tokenary',
  iconUrl: (import.meta.glob<{ default: string }>('./tokenaryWallet.svg',{ query: '?url',eager: true }))['./tokenaryWallet.svg'].default,
  iconBackground: '#ffffff',
  installed: hasInjectedProvider({ flag: 'isTokenary' }),
  hidden: () => !isSafari,
  downloadUrls: {
    ios: 'https://tokenary.io/get',
    mobile: 'https://tokenary.io',
    qrCode: 'https://tokenary.io/get',
    safari: 'https://tokenary.io/get',
    browserExtension: 'https://tokenary.io/get',
  },
  createConnector: getInjectedConnector({ flag: 'isTokenary' }),
});
