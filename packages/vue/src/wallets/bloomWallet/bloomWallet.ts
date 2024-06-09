import { isMobile } from '@/utils/mobile';
import { DefaultWalletOptions,Wallet } from '@/types/composables/wallet';
import { getWalletConnectConnector} from '@/utils/wallet';

export const bloomWallet = ({
  projectId,
  walletConnectParameters,
}: DefaultWalletOptions): Wallet => ({
  id: 'bloomWallet',
  name: 'Bloom Wallet',
  iconBackground: '#000',
  iconAccent: '#000',
  hidden: () => isMobile,
  iconUrl: (import.meta.glob<{ default: string }>('./bloomWallet.svg',{ query: '?url',eager: true }))['./bloomWallet.svg'].default,
  downloadUrls: {
    qrCode: 'https://bloomwallet.io/',
    windows: 'https://bloomwallet.io/',
    macos: 'https://bloomwallet.io/',
    linux: 'https://bloomwallet.io/',
    desktop: 'https://bloomwallet.io/',
  },
  qrCode: {
    getUri: (uri: string) =>
      `bloom://wallet-connect/wc?uri=${encodeURIComponent(uri)}`,
    instructions: {
      learnMoreUrl: 'https://bloomwallet.io/',
      steps: [
        {
          description: 'wallet_connectors.bloom.qr_code.step1.description',
          step: 'install',
          title: 'wallet_connectors.bloom.qr_code.step1.title',
        },
        {
          description: 'wallet_connectors.bloom.qr_code.step2.description',
          step: 'create',
          title: 'wallet_connectors.bloom.qr_code.step2.title',
        },
        {
          description: 'wallet_connectors.bloom.qr_code.step3.description',
          step: 'refresh',
          title: 'wallet_connectors.bloom.qr_code.step3.title',
        },
      ],
    },
  },
  deskstop: {
    getUri: (uri: string) =>
      `bloom://wallet-connect/wc?uri=${encodeURIComponent(uri)}`,
    instructions: {
      learnMoreUrl: 'https://bloomwallet.io/',
      steps: [
        {
          description: 'wallet_connectors.bloom.desktop.step1.description',
          step: 'install',
          title: 'wallet_connectors.bloom.desktop.step1.title',
        },
        {
          description: 'wallet_connectors.bloom.desktop.step2.description',
          step: 'create',
          title: 'wallet_connectors.bloom.desktop.step2.title',
        },
        {
          description: 'wallet_connectors.bloom.desktop.step3.description',
          step: 'refresh',
          title: 'wallet_connectors.bloom.desktop.step3.title',
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({
    projectId,
    walletConnectParameters,
  }),
});
