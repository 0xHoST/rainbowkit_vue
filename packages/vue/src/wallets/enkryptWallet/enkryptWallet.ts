import type { Wallet } from '@/types/composables/wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '@/utils/wallet';

export const enkryptWallet = (): Wallet => {
  return {
    id: 'enkrypt',
    name: 'Enkrypt Wallet',
    rdns: 'com.enkrypt',
    installed: hasInjectedProvider({ namespace: 'enkrypt.providers.ethereum' }),
    iconUrl: (import.meta.glob<{ default: string }>('./enkryptWallet.svg',{ query: '?url',eager: true }))['./enkryptWallet.svg'].default,
    iconBackground: '#FFFFFF',
    downloadUrls: {
      qrCode: 'https://www.enkrypt.com',
      chrome:
        'https://chrome.google.com/webstore/detail/enkrypt-ethereum-polkadot/kkpllkodjeloidieedojogacfhpaihoh',
      browserExtension: 'https://www.enkrypt.com/',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/enkrypt-ethereum-polkad/gfenajajnjjmmdojhdjmnngomkhlnfjl',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/enkrypt/',
      opera: 'https://addons.opera.com/en/extensions/details/enkrypt/',
      safari: 'https://apps.apple.com/app/enkrypt-web3-wallet/id1640164309',
    },
    extensions: {
      instructions: {
        learnMoreUrl: 'https://blog.enkrypt.com/what-is-a-web3-wallet/',
        steps: [
          {
            description:
              'wallet_connectors.enkrypt.extension.step1.description',
            step: 'install',
            title: 'wallet_connectors.enkrypt.extension.step1.title',
          },
          {
            description:
              'wallet_connectors.enkrypt.extension.step2.description',
            step: 'create',
            title: 'wallet_connectors.enkrypt.extension.step2.title',
          },
          {
            description:
              'wallet_connectors.enkrypt.extension.step3.description',
            step: 'refresh',
            title: 'wallet_connectors.enkrypt.extension.step3.title',
          },
        ],
      },
    },
    createConnector: getInjectedConnector({
      namespace: 'enkrypt.providers.ethereum',
    }),
  };
};
