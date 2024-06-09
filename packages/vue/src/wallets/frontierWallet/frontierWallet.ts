import { isAndroid } from '@/utils/mobile';
import { Wallet,DefaultWalletOptions } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
  getWalletConnectConnector,
} from '@/utils/wallet';

export type FrontierWalletOptions = DefaultWalletOptions;

export const frontierWallet = ({
  projectId,
  walletConnectParameters,
}: FrontierWalletOptions): Wallet => {
  const isFrontierInjected = hasInjectedProvider({
    namespace: 'frontier.ethereum',
    flag: 'isFrontier',
  });
  const shouldUseWalletConnect = !isFrontierInjected;
  return {
    id: 'frontier',
    name: 'Frontier Wallet',
    rdns: 'xyz.frontier.wallet',
    installed: isFrontierInjected,
    iconUrl: (import.meta.glob<{ default: string }>('./frontierWallet.svg',{ query: '?url',eager: true }))['./frontierWallet.svg'].default,
    iconBackground: '#CC703C',
    downloadUrls: {
      android:
        'https://play.google.com/store/apps/details?id=com.frontierwallet',
      ios: 'https://apps.apple.com/us/app/frontier-crypto-defi-wallet/id1482380988',
      qrCode: 'https://www.frontier.xyz/download',
      chrome:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      browserExtension: 'https://www.frontier.xyz/download',
    },

    mobile: {
      getUri: shouldUseWalletConnect
        ? (uri: string) => {
            return isAndroid
              ? `frontier://wc?uri=${encodeURIComponent(uri)}`
              : uri;
          }
        : undefined,
    },
    qrCode: shouldUseWalletConnect
      ? {
          getUri: (uri: string) => {
            return isAndroid
              ? `frontier://wc?uri=${encodeURIComponent(uri)}`
              : uri;
          },
          instructions: {
            learnMoreUrl: 'https://help.frontier.xyz/en/',
            steps: [
              {
                description:
                  'wallet_connectors.im_token.qr_code.step1.description',
                step: 'install',
                title: 'wallet_connectors.im_token.qr_code.step1.title',
              },
              {
                description:
                  'wallet_connectors.im_token.qr_code.step2.description',
                step: 'create',
                title: 'wallet_connectors.im_token.qr_code.step2.title',
              },
              {
                description:
                  'wallet_connectors.im_token.qr_code.step3.description',
                step: 'scan',
                title: 'wallet_connectors.im_token.qr_code.step3.title',
              },
            ],
          },
        }
      : undefined,
    extensions: {
      instructions: {
        learnMoreUrl:
          'https://help.frontier.xyz/en/articles/6967236-setting-up-frontier-on-your-device',
        steps: [
          {
            description:
              'wallet_connectors.frontier.extension.step1.description',
            step: 'install',
            title: 'wallet_connectors.frontier.extension.step1.title',
          },
          {
            description:
              'wallet_connectors.frontier.extension.step2.description',
            step: 'create',
            title: 'wallet_connectors.frontier.extension.step2.title',
          },
          {
            description:
              'wallet_connectors.frontier.extension.step3.description',
            step: 'refresh',
            title: 'wallet_connectors.frontier.extension.step3.title',
          },
        ],
      },
    },
    createConnector: shouldUseWalletConnect
      ? getWalletConnectConnector({ projectId, walletConnectParameters })
      : getInjectedConnector({
          namespace: 'frontier.ethereum',
          flag: 'isFrontier',
        }),
  };
};
