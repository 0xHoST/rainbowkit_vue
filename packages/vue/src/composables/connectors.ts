import { addRecentWalletId, isEIP6963Connector, isRainbowKitConnector, isRecentWallet, getRainbowKitConnectorWithWalletConnect, getRecentWalletIds, getConnectorsWithRecentWallets, getDeskstopDownloadUrl, getExtensionDownloadUrl, getMobileDownloadUrl } from '@/utils'
import { useRainbowKitChainContext } from '@/composables/chain'
import { type WagmiConnectorInstance, type WalletInstance, type WalletConnector, mainnet } from '@/types'
import { useConnect, Connector, useChainId } from '@wagmi/vue'
import { computed, ComputedRef } from 'vue'

export function useWalletConectors(mergeEIP6963WithRkConnectors = false) : ComputedRef<Array<WalletConnector>> {
  const MAX_RECENT_WALLETS = 3
  const { rainbowKitChains,initialChainId, ignoreChainModalOnConnect } = useRainbowKitChainContext()
  const { connectAsync, connectors: defaultUntypedConnector } = useConnect()
  const currentChainId = useChainId();
 
  const computeChainId = async (connector: Connector)=>{
    if(initialChainId?.value) return initialChainId.value;
    if(ignoreChainModalOnConnect?.value) return currentChainId.value;
    const walletChainId = await connector.getChainId();
    if(rainbowKitChains?.value == undefined) return mainnet.id;
    const newRainbowKitChains  = rainbowKitChains.value;
    return newRainbowKitChains.find(({ id }) => id === walletChainId)?.id ?? newRainbowKitChains[0].id;
  }

  const connectWallet = async (connector: Connector) => {
    const chainId = await computeChainId(connector);
    const result = await connectAsync({ chainId, connector })

    if (result) {
      addRecentWalletId(connector.id)
    }
    return result
  }
  const connectToWalletConnectModal = async (walletConnectModalConnector: Connector) => {
    try {
      return await connectWallet(walletConnectModalConnector)
    } catch (err) {
      const isUserRejection =
        // @ts-expect-error - Web3Modal v1 error name
        err.name === 'UserRejectedRequestError' ||
        // @ts-expect-error - Web3Modal v2 error message on desktop
        err.message === 'Connection request reset. Please try again.'

      if (!isUserRejection) {
        throw err
      }
    }
  }
  const getWalletConnectUri = async (
    connector: Connector,
    uriConverter: (uri: string) => string
  ): Promise<string> => {

    /// Provider error from @wagmi/vue.
    //const chainId = await connector.getChainId();
    const provider = await connector.getProvider();
    if (connector.id === 'coinbase') {
      // @ts-expect-error
      return provider.qrUrl
    }

    return new Promise<string>((resolve)=>{

        // Wagmi v2 doesn't have a return type for provider yet
        //@ts-expect-error
        provider.once('display_uri', (uri: string) => {
          resolve(uriConverter(uri))
        })

        /////@ts-expect-error
        /*connector.onDisplayUri((uri:string)=>{
          resolve(uriConverter(uri))
        })*/
        
        //resolve(uriConverter(''));
      }
    )
  }
  
  const isNotWalletConnectModal = (wallet: WalletInstance) => !wallet.isWalletConnectModalConnector
  const notExistsInEIP6963WithRkConnectors = (wallet: WalletInstance, connectors: Array<WalletInstance>) => {
    if (!mergeEIP6963WithRkConnectors) return true
    return !connectors.some((eip6963) => eip6963.id == wallet.rdns)
  }

  return computed<Array<WalletConnector>>(()=>{
    const connectors: Array<WalletConnector> = [];
    const defaultCreatedConnectors = defaultUntypedConnector as Array<WagmiConnectorInstance>
    const defaultConnectors = defaultCreatedConnectors.map((connector) => ({
      ...connector,
      // details is optional it does not exist in eip6963 connectors.
      // We only inject `details` in `connectorsForWallets` when we
      // want to have additional information in the connector.
      ...(connector.details || {})
    })) as WalletInstance[];

    const walletConnectModalConnector = defaultConnectors.find(
      (connector) => connector.id === 'walletConnect' && connector.isWalletConnectModalConnector
    )
    const eip6963Connectors = defaultConnectors.filter(isEIP6963Connector).map((connector) => {
      return {
        ...connector,
        groupIndex: 0
      }
    })  

    const filteredConnectors = defaultConnectors.filter(isRainbowKitConnector)
        .filter(isNotWalletConnectModal)
        .filter((instance)=>notExistsInEIP6963WithRkConnectors(instance,eip6963Connectors))
        .map((wallet) => getRainbowKitConnectorWithWalletConnect(wallet, walletConnectModalConnector!))
    const wallets = [...eip6963Connectors, ...filteredConnectors]
    const walletInstanceById = wallets.indexBy((walletInstance) => walletInstance.id)
    const recentWallets: WalletInstance[] = getRecentWalletIds()
      .map((walletId) => walletInstanceById[walletId])
      .filter(Boolean)
      .slice(0, MAX_RECENT_WALLETS)
    const combinedConnectorsWithRecentWallets = getConnectorsWithRecentWallets({
      wallets,
      recentWallets
    })
    for (const wallet of combinedConnectorsWithRecentWallets) {
      if (!wallet) continue
      const eip6963 = isEIP6963Connector(wallet)
      const recent = isRecentWallet(recentWallets, wallet.id)
  
      if (eip6963) {
        connectors.push({
          ...wallet,
          iconUrl: wallet.icon ?? '',
          ready: true,
          connect: () => connectWallet(wallet),
          groupName: 'Installed',
          recent
        })
        continue
      }

      if(connectors.some((connector)=> connector.id === wallet.id)){
        continue;
      }
      
      connectors.push({
        ...wallet,
        ready: wallet.installed ?? true,
        recent,
        connect: () => connectWallet(wallet),
        desktopDownloadUrl: getDeskstopDownloadUrl(wallet),
        extensionDownloadUrl: getExtensionDownloadUrl(wallet),
        groupName: wallet.groupName,
        mobileDownloadUrl: getMobileDownloadUrl(wallet),
        getQrCodeUri: wallet.qrCode?.getUri
          ? () => getWalletConnectUri(wallet, wallet.qrCode?.getUri!)
          : undefined,
        getDesktopUri: wallet.deskstop?.getUri
          ? () => getWalletConnectUri(wallet, wallet.deskstop?.getUri!)
          : undefined,
        getMobileUri: wallet.mobile?.getUri
          ? () => getWalletConnectUri(wallet, wallet.mobile?.getUri!)
          : undefined,
        showWalletConnectModal: wallet.walletConnectModalConnector
          ? () => connectToWalletConnectModal(wallet.walletConnectModalConnector!)
          : undefined
      })
      
    }
    return connectors;
  });
}
