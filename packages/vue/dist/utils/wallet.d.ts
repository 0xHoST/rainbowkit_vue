import { walletConnect } from '@wagmi/vue/connectors';
import { type CreateConnectorFn, type WalletList, type ConnectorsWithWalletsParams, type CreateConnector, type GetOrCreateWalletConnectInstanceParams, type GetWalletConnectConnectorParams, type InjectedProviderRequest, type RainbowKitWalletConnectParameters, type WalletConnectorsParam, type WalletInstance, type WalletMetaDataParameters } from "../types/index";
export declare const computeWalletConnectMetadata: ({ appName, appDescription, appUrl, appIcon }: WalletMetaDataParameters) => RainbowKitWalletConnectParameters['metadata'];
export declare const getConnectors: (items: WalletList, params: WalletConnectorsParam) => CreateConnectorFn[];
export declare const getExtensionDownloadUrl: (wallet: WalletInstance) => string | undefined;
export declare const getMobileDownloadUrl: (wallet: WalletInstance) => string | undefined;
export declare const getDeskstopDownloadUrl: (wallet: WalletInstance) => string | undefined;
export declare const getDefaultWallets: (parameters?: WalletConnectorsParam) => {
    connectors?: CreateConnectorFn[] | undefined;
    wallets: WalletList;
};
export declare const getExplicitInjectedProvider: (flag: string) => any | undefined;
export declare const getNamespaceInjectedProvider: (namespace: string) => any;
export declare const hasInjectedProvider: (request: InjectedProviderRequest) => boolean;
export declare const getInjectedProvider: (request: InjectedProviderRequest) => any;
export declare const createInjectedConnector: (provider?: any) => CreateConnector;
export declare const getInjectedConnector: (request: InjectedProviderRequest) => CreateConnector;
export declare const getOrCreateWalletConnectInstance: (params: GetOrCreateWalletConnectInstanceParams) => ReturnType<typeof walletConnect>;
export declare const getWalletConnectConnector: (params: GetWalletConnectConnectorParams) => CreateConnector;
export declare const mergeWallets: (newWallets: Array<WalletInstance>, existingWallets: Array<WalletInstance>) => Array<WalletInstance>;
export declare const isRecentWallet: (recentWallets: WalletInstance[], walletId: string) => boolean;
export declare const isRainbowKitConnector: (wallet: WalletInstance) => boolean;
export declare const isEIP6963Connector: (wallet: WalletInstance) => boolean;
export declare const getRainbowKitConnectorWithWalletConnect: (wallet: WalletInstance, walletConnectModalConnector: WalletInstance) => WalletInstance;
export declare const getConnectorsWithRecentWallets: ({ wallets, recentWallets }: ConnectorsWithWalletsParams) => WalletInstance[];
export declare const getLatestWalletId: () => string;
export declare const addLatestWalletId: (walletId: string) => void;
export declare const clearLatestWalletIdentifier: () => void;
export declare const getRecentWalletIds: () => string[];
export declare const addRecentWalletId: (walletId: string) => void;
//# sourceMappingURL=wallet.d.ts.map