import { WalletConnectStoreContextKey } from "@/types";
import { addRecentWalletId, computeChainId, getWalletConnectWallet, getWalletsFromConnectors, WalletConnectStore } from "@/utils";
import { Connector, useChainId, useConfig, useConnect } from "@wagmi/vue";
import { inject } from "vue";
import { useRainbowKitChainContext } from "./chain";
import { useModalContext } from "./modal";

export function configureWalletConnectStoreContext(){
    const store = useWalletConnectStoreContext();
    const config = useConfig();
    const { connectors } = useConnect();

    const wallets = getWalletsFromConnectors({ connectors });
    
    const connector = getWalletConnectWallet({
        walletId: 'walletConnect',
        wallets,
      })?.createWalletConnectModalConnector;
    
    ///preload wallet connect   
    if(connector){
        store.createWalletConnectModalConnector({ createConnector:connector, config });
    }
}

export function createWalletConnectStoreContext(){
    return new WalletConnectStore();
}

export function useWalletConnectStoreContext(){
    const context = inject(WalletConnectStoreContextKey);
    if(!context){
        throw Error(`Could not find injected '${String(WalletConnectStoreContextKey)}' instance.`);
    }
    return context;
}

export function useWalletConnectRequestUri(){

    const store = useWalletConnectStoreContext();
    
    const config = useConfig();
    const currentChainId = useChainId();
    const { connectors, connect } = useConnect();
    const { initialChainId, rainbowKitChains: chains, enableChainModalOnConnect: ignoreChainModalOnConnect } = useRainbowKitChainContext();

    const wallets = getWalletsFromConnectors({ connectors });
    const connector = getWalletConnectWallet({ wallets });

    if(!connector) return;
    
    store.requestWalletConnectUri({
        config,
        connect,
        currentChainId: currentChainId.value,
        chains: chains?.value ?? [],
        walletConnectWallet: connector,
        initialChainId: initialChainId?.value,
        ignoreChainModalOnConnect: ignoreChainModalOnConnect?.value ?? false,
    });
}

export function useWalletConnectModal(){
    const { initialChainId, rainbowKitChains: chains, enableChainModalOnConnect: ignoreChainModalOnConnect } = useRainbowKitChainContext();
    const { isWalletConnectModalOpen } = useModalContext();
    const { connectAsync } = useConnect();
    const store = useWalletConnectStoreContext();
    
    async function connectWallet(connector: Connector) {
        const walletChainId = await connector.getChainId();
        const chainId = computeChainId({
            initialChainId: initialChainId?.value,
            chains: chains?.value,
            walletChainId,
            ignoreChainModalOnConnect: ignoreChainModalOnConnect?.value?? false
        });
        const result = await connectAsync({ chainId, connector });
        if(!result) return;
        addRecentWalletId(connector.id);
    }

    async function openWalletConnectModal(){
        const connector = store.currentWalletConnectConnector;
        if(!connector) return;
        try{
            isWalletConnectModalOpen.value = true;
            await connectWallet({
                ...connector,
                id: 'walletConnect'
            });
            store.resetWalletConnectUri();
            isWalletConnectModalOpen.value = false;
        }catch(err){
            const isUserRejection =
            // @ts-expect-error - Web3Modal v1 error name
            err.name === 'UserRejectedRequestError' ||
            // @ts-expect-error - Web3Modal v2 error message on desktop
            err.message === 'Connection request reset. Please try again.';

            isWalletConnectModalOpen.value = false;
            if (!isUserRejection) {
                throw err;
            }
        }
    }

    return { openWalletConnectModal }
}