import { RainbowKitWalletConnectParameters, Wallet } from '@/types/composables/wallet';
import { getWalletConnectConnector } from '@/utils/wallet';

export interface WalletConnectWalletOptions {
  projectId: string;
  options?: RainbowKitWalletConnectParameters;
}

export const walletConnectWallet = ({
  projectId,
  options,
}: WalletConnectWalletOptions): Wallet => {
  const getUri = (uri: string) => uri;

  return {
    id: 'walletConnect',
    name: 'WalletConnect',
    installed: undefined,
    iconUrl: (import.meta.glob<{ default: string }>('./walletConnectWallet.svg',{ query: '?url',eager: true }))['./walletConnectWallet.svg'].default,
    iconBackground: '#3b99fc',
    qrCode: { getUri },
    createConnector: getWalletConnectConnector({
      projectId,
      walletConnectParameters: options,
    }),
  };
};
