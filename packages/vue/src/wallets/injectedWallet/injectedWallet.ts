
import { getInjectedConnector } from '@/utils/wallet';
import type { Wallet } from '@/types'

export const injectedWallet = (): Wallet => {
  return {
    id: 'injected',
    name: 'Browser Wallet',
    iconUrl: async () => (await import('./injectedWallet.svg')).default,
    iconBackground: '#fff',
    createConnector: getInjectedConnector({})
  }
}
