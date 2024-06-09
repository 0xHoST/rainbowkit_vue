import { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const oneKeyWallet = (): Wallet => {
  return {
    id: 'onekey',
    name: 'OneKey',
    iconAccent: '#00B812',
    iconBackground: '#fff',
    iconUrl: (import.meta.glob<{ default: string }>('./oneKeyWallet.svg',{ query: '?url',eager: true }))['./oneKeyWallet.svg'].default,
    installed: hasInjectedProvider({ namespace: '$onekey.ethereum' }),
    downloadUrls: {
      android:
        'https://play.google.com/store/apps/details?id=so.onekey.app.wallet',
      browserExtension: 'https://www.onekey.so/download/',
      chrome:
        'https://chrome.google.com/webstore/detail/onekey/jnmbobjmhlngoefaiojfljckilhhlhcj',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/onekey/obffkkagpmohennipjokmpllocnlndac',
      ios: 'https://apps.apple.com/us/app/onekey-open-source-wallet/id1609559473',
      mobile: 'https://www.onekey.so/download/',
      qrCode: 'https://www.onekey.so/download/',
    },
    extensions: {
      instructions: {
        learnMoreUrl: 'https://help.onekey.so/hc/en-us/categories/360000170236',
        steps: [
          {
            description:
              'wallet_connectors.one_key.extension.step1.description',
            step: 'install',
            title: 'wallet_connectors.one_key.extension.step1.title',
          },
          {
            description:
              'wallet_connectors.one_key.extension.step2.description',
            step: 'create',
            title: 'wallet_connectors.one_key.extension.step2.title',
          },
          {
            description:
              'wallet_connectors.one_key.extension.step3.description',
            step: 'refresh',
            title: 'wallet_connectors.one_key.extension.step3.title',
          },
        ],
      },
    },

    createConnector: getInjectedConnector({
      namespace: '$onekey.ethereum',
    }),
  };
};
