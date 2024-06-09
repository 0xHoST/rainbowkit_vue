import { isIOS } from '@/utils/mobile';
import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const dawnWallet = (): Wallet => ({
  id: 'dawn',
  name: 'Dawn',
  iconUrl: (import.meta.glob<{ default: string }>('./dawnWallet.svg',{ query: '?url',eager: true }))['./dawnWallet.svg'].default,
  iconBackground: '#000000',
  installed: hasInjectedProvider({ flag: 'isDawn' }),
  hidden: () => !isIOS,
  downloadUrls: {
    ios: 'https://apps.apple.com/us/app/dawn-ethereum-wallet/id1673143782',
    mobile: 'https://dawnwallet.xyz',
  },
  createConnector: getInjectedConnector({ flag: 'isDawn' }),
});
