import { isAndroid } from '@/utils/mobile';
import { DefaultWalletOptions,Wallet } from '@/types/composables/wallet';
import { getInjectedConnector, hasInjectedProvider, getWalletConnectConnector} from '@/utils/wallet';

export type BitgetWalletOptions = DefaultWalletOptions;

export const bitgetWallet = ({
  projectId,
  walletConnectParameters,
}: BitgetWalletOptions): Wallet => {
  const isBitKeepInjected = hasInjectedProvider({
    namespace: 'bitkeep.ethereum',
    flag: 'isBitKeep',
  });
  const shouldUseWalletConnect = !isBitKeepInjected;

  return {
    id: 'bitget',
    name: 'Bitget Wallet',
    iconUrl: (import.meta.glob<{ default: string }>('./bitgetWallet.svg',{ query: '?url',eager: true }))['./bitgetWallet.svg'].default,
    iconAccent: '#f6851a',
    iconBackground: '#fff',
    installed: !shouldUseWalletConnect ? isBitKeepInjected : undefined,
    downloadUrls: {
      android: 'https://web3.bitget.com/en/wallet-download?type=0',
      ios: 'https://apps.apple.com/app/bitkeep/id1395301115',
      mobile: 'https://web3.bitget.com/en/wallet-download?type=2',
      qrCode: 'https://web3.bitget.com/en/wallet-download',
      chrome:
        'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
      browserExtension: 'https://web3.bitget.com/en/wallet-download',
    },
    extensions: {
      instructions: {
        learnMoreUrl: 'https://web3.bitget.com/en/academy',
        steps: [
          {
            description: 'wallet_connectors.bitget.extension.step1.description',
            step: 'install',
            title: 'wallet_connectors.bitget.extension.step1.title',
          },
          {
            description: 'wallet_connectors.bitget.extension.step2.description',
            step: 'create',
            title: 'wallet_connectors.bitget.extension.step2.title',
          },
          {
            description: 'wallet_connectors.bitget.extension.step3.description',
            step: 'refresh',
            title: 'wallet_connectors.bitget.extension.step3.description',
          },
        ],
      },
    },
    mobile: {
      getUri: shouldUseWalletConnect
        ? (uri: string) => {
            return isAndroid
              ? uri
              : `bitkeep://wc?uri=${encodeURIComponent(uri)}`;
          }
        : undefined,
    },
    qrCode: shouldUseWalletConnect
      ? {
          getUri: (uri: string) => uri,
          instructions: {
            learnMoreUrl: 'https://web3.bitget.com/en/academy',
            steps: [
              {
                description:
                  'wallet_connectors.bitget.qr_code.step1.description',
                step: 'install',
                title: 'wallet_connectors.bitget.qr_code.step1.title',
              },
              {
                description:
                  'wallet_connectors.bitget.qr_code.step2.description',

                step: 'create',
                title: 'wallet_connectors.bitget.qr_code.step2.title',
              },
              {
                description:
                  'wallet_connectors.bitget.qr_code.step3.description',
                step: 'scan',
                title: 'wallet_connectors.bitget.qr_code.step3.title',
              },
            ],
          },
        }
      : undefined,

    createConnector: shouldUseWalletConnect
      ? getWalletConnectConnector({
          projectId,
          walletConnectParameters,
        })
      : getInjectedConnector({
          namespace: 'bitkeep.ethereum',
          flag: 'isBitKeep',
        }),
  };
};
