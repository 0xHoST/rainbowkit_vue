import { isAndroid } from '@/utils/mobile';
import { DefaultWalletOptions, Wallet } from '@/types/composables/wallet';
import { getWalletConnectConnector } from '@/utils/wallet';

export type OktoWalletOptions = DefaultWalletOptions;

export const oktoWallet = ({
  projectId,
  walletConnectParameters,
}: OktoWalletOptions): Wallet => ({
  id: 'Okto',
  name: 'Okto',
  iconUrl: (import.meta.glob<{ default: string }>('./oktoWallet.svg',{ query: '?url',eager: true }))['./oktoWallet.svg'].default,
  iconBackground: '#fff',
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=im.okto.contractwalletclient',
    ios: 'https://apps.apple.com/in/app/okto-wallet/id6450688229',
    mobile: 'https://okto.tech/',
    qrCode: 'https://okto.tech/',
  },
  mobile: {
    getUri: (uri: string) => {
      return isAndroid ? uri : `okto://wc?uri=${encodeURIComponent(uri)}`;
    },
  },
  qrCode: {
    getUri: (uri: string) => uri,
    instructions: {
      learnMoreUrl: 'https://okto.tech/',
      steps: [
        {
          description: 'wallet_connectors.okto.qr_code.step1.description',
          step: 'install',
          title: 'wallet_connectors.okto.qr_code.step1.title',
        },
        {
          description: 'wallet_connectors.okto.qr_code.step2.description',
          step: 'create',
          title: 'wallet_connectors.okto.qr_code.step2.title',
        },
        {
          description: 'wallet_connectors.okto.qr_code.step3.description',
          step: 'scan',
          title: 'wallet_connectors.okto.qr_code.step3.title',
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({
    projectId,
    walletConnectParameters,
  }),
});
