import type { CreateConnectorFn, Wallet, WalletDetailsParams } from '@/types';
import { isIOS} from "@/utils/mobile";
import { coinbaseWallet as coinbaseConnector, CoinbaseWalletParameters } from '@wagmi/vue/connectors';
import { createConnector } from '@wagmi/vue';
import { hasInjectedProvider } from '@/utils/wallet';

export interface CoinbaseWalletOptions {
  appName: string;
  appIcon?: string;
}

const getCoinbaseWallet = (preference:CoinbaseWalletParameters<'4'>['preference'] = 'all') => 
  preference === 'eoaOnly' ? eoa : 
  preference === 'all' ? all : smartWallet;

export const coinbaseWallet = {
  get all() {
    return getCoinbaseWallet('all')
  },
  get smartWallet(){
    return getCoinbaseWallet('smartWalletOnly')
  },
  get eoa(){
    return getCoinbaseWallet('eoaOnly')
  },
} as const;

const common = () : Pick<Wallet,'iconUrl'|'iconBackground'|'downloadUrls'|'iconAccent'|'qrCode'> => {
  const getUri = (uri: string) => uri;
  const ios = isIOS;

  return {
    iconUrl:  (import.meta.glob<{ default: string }>('./coinbaseWallet.svg',{ query: '?url',eager: true }))['./coinbaseWallet.svg'].default,
    iconAccent: '#2c5ff6',
    iconBackground: '#2c5ff6',
    downloadUrls: {
      android: 'https://play.google.com/store/apps/details?id=org.toshi',
      ios: 'https://apps.apple.com/us/app/coinbase-wallet-store-crypto/id1278383455',
      mobile: 'https://coinbase.com/wallet/downloads',
      qrCode: 'https://coinbase-wallet.onelink.me/q5Sx/fdb9b250',
      chrome:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      browserExtension: 'https://coinbase.com/wallet',
    },
    ...(ios
      ? {}
      : {
          qrCode: {
            getUri,
            instructions: {
              learnMoreUrl:
                'https://coinbase.com/wallet/articles/getting-started-mobile',
              steps: [
                {
                  description:
                    'wallet_connectors.coinbase.qr_code.step1.description',
                  step: 'install',
                  title: 'wallet_connectors.coinbase.qr_code.step1.title',
                },
                {
                  description:
                    'wallet_connectors.coinbase.qr_code.step2.description',
                  step: 'create',
                  title: 'wallet_connectors.coinbase.qr_code.step2.title',
                },
                {
                  description:
                    'wallet_connectors.coinbase.qr_code.step3.description',
                  step: 'scan',
                  title: 'wallet_connectors.coinbase.qr_code.step3.title',
                },
              ],
            },
          },
          extension: {
            instructions: {
              learnMoreUrl:
                'https://coinbase.com/wallet/articles/getting-started-extension',
              steps: [
                {
                  description:
                    'wallet_connectors.coinbase.extension.step1.description',
                  step: 'install',
                  title: 'wallet_connectors.coinbase.extension.step1.title',
                },
                {
                  description:
                    'wallet_connectors.coinbase.extension.step2.description',
                  step: 'create',
                  title: 'wallet_connectors.coinbase.extension.step2.title',
                },
                {
                  description:
                    'wallet_connectors.coinbase.extension.step3.description',
                  step: 'refresh',
                  title: 'wallet_connectors.coinbase.extension.step3.title',
                },
              ],
            },
          },
        }),
  }
}

const all = ({
  appName,
  appIcon,
}: CoinbaseWalletOptions) : Wallet=> {

  const isCoinbaseInjected = hasInjectedProvider({ flag: 'isCoinbaseWallet' });
  const sharedProps = common();

  return {
    id: isCoinbaseInjected ? 'coinbase' : 'coinbase-smart-wallet',
    name: isCoinbaseInjected ?'Coinbase Wallet' : 'Coinbase Smart Wallet',
    shortName: 'Coinbase',
    rdns: 'com.coinbase.wallet',
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) => {
      const connector: CreateConnectorFn = coinbaseConnector({
        appName,
        appLogoUrl: appIcon,
        preference: 'all',
        version: '4',
      });
      return createConnector((config) =>({
          ...connector(config),
          ...walletDetails
      }));
    },
    ...sharedProps,
  };
};

const smartWallet = ({
  appName,
  appIcon,
}: CoinbaseWalletOptions) : Wallet=> {
  const sharedProps = common();

  return {
    id: 'coinbase-smart-wallet',
    name: 'Coinbase Smart Wallet',
    shortName: 'Coinbase',
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) => {
      const connector: CreateConnectorFn = coinbaseConnector({
        appName,
        appLogoUrl: appIcon,
        preference: 'smartWalletOnly',
        version: '4',
      });
      return createConnector((config) => 
        ({
          ...connector(config),
          ...walletDetails
        })
      );
    },
    ...sharedProps
  };
};

const eoa = ({
  appName,
  appIcon,
}: CoinbaseWalletOptions) : Wallet=> {

  const isCoinbaseInjected = hasInjectedProvider({ flag: 'isCoinbaseWallet' });
  const sharedProps = common();

  return {
    id: 'coinbase-eoa',
    name: 'Coinbase Wallet',
    shortName: 'Coinbase',
    rdns: 'com.coinbase.wallet',
    installed: isCoinbaseInjected,
    createConnector: (walletDetails: WalletDetailsParams) => {
      const connector: CreateConnectorFn = coinbaseConnector({
        appName,
        appLogoUrl: appIcon,
        preference: 'eoaOnly',
        version: '4',
      });
      return createConnector((config) => 
        ({
          ...connector(config),
          ...walletDetails
        }));
    },
    ...sharedProps
  };
};