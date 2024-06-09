import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const braveWallet = (): Wallet => ({
  id: 'brave',
  name: 'Brave Wallet',
  rdns: 'com.brave.wallet',
  iconUrl: (import.meta.glob<{ default: string }>('./braveWallet.svg',{ query: '?url',eager: true }))['./braveWallet.svg'].default,
  iconBackground: '#fff',
  installed: hasInjectedProvider({ flag: 'isBraveWallet' }),
  downloadUrls: {
    // We're opting not to provide a download prompt if Brave isn't the current
    // browser since it's unlikely to be a desired behavior for users. It's
    // more of a convenience for users who are already using Brave rather than
    // an explicit wallet choice for users coming from other browsers.
  },
  createConnector: getInjectedConnector({ flag: 'isBraveWallet' }),
});
