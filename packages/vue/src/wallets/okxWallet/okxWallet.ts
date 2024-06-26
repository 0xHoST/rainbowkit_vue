import { isAndroid } from '@/utils/mobile';
import { DefaultWalletOptions, Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
  getWalletConnectConnector
} from '@/utils/wallet';

export type OKXWalletOptions = DefaultWalletOptions;

export const okxWallet = ({
  projectId,
  walletConnectParameters,
}: OKXWalletOptions): Wallet => {
  const isOKXInjected = hasInjectedProvider({ namespace: 'okxwallet' });
  const shouldUseWalletConnect = !isOKXInjected;

  return {
    id: 'okx',
    name: 'OKX Wallet',
    rdns: 'com.okex.wallet',
    iconUrl: (import.meta.glob<{ default: string }>('./okxWallet.svg',{ query: '?url',eager: true }))['./okxWallet.svg'].default,
    iconAccent: '#000',
    iconBackground: '#000',
    downloadUrls: {
      android:
        'https://play.google.com/store/apps/details?id=com.okinc.okex.gp',
      ios: 'https://itunes.apple.com/app/id1327268470?mt=8',
      mobile: 'https://okx.com/download',
      qrCode: 'https://okx.com/download',
      chrome:
        'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/okx-wallet/pbpjkcldjiffchgbbndmhojiacbgflha',
      firefox: 'https://addons.mozilla.org/firefox/addon/okexwallet/',
      browserExtension: 'https://okx.com/download',
    },
    mobile: {
      getUri: shouldUseWalletConnect
        ? (uri: string) => {
            return isAndroid
              ? uri
              : `okex://main/wc?uri=${encodeURIComponent(uri)}`;
          }
        : undefined,
    },
    qrCode: shouldUseWalletConnect
      ? {
          getUri: (uri: string) => uri,
          instructions: {
            learnMoreUrl: 'https://okx.com/web3/',
            steps: [
              {
                description: 'wallet_connectors.okx.qr_code.step1.description',
                step: 'install',
                title: 'wallet_connectors.okx.qr_code.step1.title',
              },
              {
                description: 'wallet_connectors.okx.qr_code.step2.description',
                step: 'create',
                title: 'wallet_connectors.okx.qr_code.step2.title',
              },
              {
                description: 'wallet_connectors.okx.qr_code.step3.description',
                step: 'scan',
                title: 'wallet_connectors.okx.qr_code.step3.title',
              },
            ],
          },
        }
      : undefined,
    extensions: {
      instructions: {
        learnMoreUrl: 'https://okx.com/web3/',
        steps: [
          {
            description: 'wallet_connectors.okx.extension.step1.description',
            step: 'install',
            title: 'wallet_connectors.okx.extension.step1.title',
          },
          {
            description: 'wallet_connectors.okx.extension.step2.description',
            step: 'create',
            title: 'wallet_connectors.okx.extension.step2.title',
          },
          {
            description: 'wallet_connectors.okx.extension.step3.description',
            step: 'refresh',
            title: 'wallet_connectors.okx.extension.step3.title',
          },
        ],
      },
    },

    createConnector: shouldUseWalletConnect
      ? getWalletConnectConnector({
          projectId,
          walletConnectParameters,
        })
      : getInjectedConnector({ namespace: 'okxwallet' }),
  };
};
