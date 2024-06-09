import { isAndroid } from '@/utils/mobile';
import { DefaultWalletOptions, Wallet } from '@/types/composables/wallet';
import { getWalletConnectConnector } from '@/utils/wallet';

export type OmniWalletOptions = DefaultWalletOptions;

export const omniWallet = ({
  projectId,
  walletConnectParameters,
}: OmniWalletOptions): Wallet => ({
  id: 'omni',
  name: 'Omni',
  iconUrl: (import.meta.glob<{ default: string }>('./omniWallet.svg',{ query: '?url',eager: true }))['./omniWallet.svg'].default,
  iconBackground: '#000',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=fi.steakwallet.app',
    ios: 'https://itunes.apple.com/us/app/id1569375204',
    mobile: 'https://omniwallet.app.link',
    qrCode: 'https://omniwallet.app.link',
  },
  mobile: {
    getUri: (uri: string) => {
      return isAndroid ? uri : `omni://wc?uri=${encodeURIComponent(uri)}`;
    },
  },
  qrCode: {
    getUri: (uri: string) => uri,
    instructions: {
      learnMoreUrl: 'https://omni.app/support',
      steps: [
        {
          description: 'wallet_connectors.omni.qr_code.step1.description',
          step: 'install',
          title: 'wallet_connectors.omni.qr_code.step1.title',
        },
        {
          description: 'wallet_connectors.omni.qr_code.step2.description',
          step: 'create',
          title: 'wallet_connectors.omni.qr_code.step2.title',
        },
        {
          description: 'wallet_connectors.omni.qr_code.step3.description',
          step: 'scan',
          title: 'wallet_connectors.omni.qr_code.step3.title',
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({
    projectId,
    walletConnectParameters,
  }),
});
